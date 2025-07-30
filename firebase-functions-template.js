// Firebase Functions Template for Server-side Validation
// Copy this to your Firebase Functions directory

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// User data validation on write
exports.validateUserData = functions.firestore
  .document('users/{userId}')
  .onWrite(async (change, context) => {
    const userId = context.params.userId;
    const newData = change.after.exists ? change.after.data() : null;
    
    if (!newData) return; // Document deleted
    
    // Validate user data
    const errors = [];
    
    // Name validation
    if (newData.name) {
      if (typeof newData.name !== 'string' || newData.name.length < 2 || newData.name.length > 50) {
        errors.push('Invalid name length');
      }
      
      // Check for XSS attempts
      if (/<script|javascript:|on\w+=/i.test(newData.name)) {
        errors.push('Invalid characters in name');
      }
    }
    
    // Email validation
    if (newData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newData.email)) {
        errors.push('Invalid email format');
      }
    }
    
    // Role validation
    if (newData.role && !['user', 'admin', 'moderator'].includes(newData.role)) {
      errors.push('Invalid role');
    }
    
    // If validation fails, revert the write
    if (errors.length > 0) {
      console.error('User validation failed:', userId, errors);
      
      // Revert to previous data or delete if new document
      if (change.before.exists) {
        await change.after.ref.set(change.before.data());
      } else {
        await change.after.ref.delete();
      }
      
      // Log security event
      await admin.firestore().collection('security_logs').add({
        type: 'validation_failed',
        userId,
        errors,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        data: newData
      });
    }
  });

// Admin role management (secure)
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Check if current user is admin
  const currentUser = await admin.auth().getUser(context.auth.uid);
  if (!currentUser.customClaims?.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set admin roles');
  }
  
  const { uid, role } = data;
  
  // Validate role
  if (!['user', 'admin', 'moderator'].includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid role');
  }
  
  // Set custom claims
  const claims = role === 'admin' ? { admin: true, moderator: true } : 
                 role === 'moderator' ? { moderator: true } : {};
  
  await admin.auth().setCustomUserClaims(uid, claims);
  
  // Update Firestore
  await admin.firestore().collection('users').doc(uid).update({
    role,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: context.auth.uid
  });
  
  // Log admin action
  await admin.firestore().collection('admin_logs').add({
    action: 'role_change',
    targetUser: uid,
    newRole: role,
    performedBy: context.auth.uid,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true, message: 'Role updated successfully' };
});

// Secure file upload validation
exports.validateFileUpload = functions.storage.object().onFinalize(async (object) => {
  const filePath = object.name;
  const contentType = object.contentType;
  const size = parseInt(object.size);
  
  // Validate file type
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/webp',
    'video/mp4', 'video/webm'
  ];
  
  if (!allowedTypes.includes(contentType)) {
    console.error('Invalid file type:', contentType);
    await admin.storage().bucket().file(filePath).delete();
    return;
  }
  
  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (size > maxSize) {
    console.error('File too large:', size);
    await admin.storage().bucket().file(filePath).delete();
    return;
  }
  
  // Validate file path
  if (!filePath.match(/^(avatars|products|admin)\//)) {
    console.error('Invalid file path:', filePath);
    await admin.storage().bucket().file(filePath).delete();
    return;
  }
  
  console.log('File validated successfully:', filePath);
});

// Rate limiting for sensitive operations
const rateLimit = new Map();

function checkRateLimit(userId, action, maxAttempts = 5, windowMs = 60000) {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const attempts = rateLimit.get(key) || [];
  
  // Clean old attempts
  const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
  
  if (validAttempts.length >= maxAttempts) {
    return false; // Rate limit exceeded
  }
  
  validAttempts.push(now);
  rateLimit.set(key, validAttempts);
  return true;
}

// Secure password reset
exports.securePasswordReset = functions.https.onCall(async (data, context) => {
  const { email } = data;
  
  // Basic validation
  if (!email || typeof email !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Valid email required');
  }
  
  // Rate limiting
  const clientIP = context.rawRequest?.ip || 'unknown';
  if (!checkRateLimit(clientIP, 'password_reset', 3, 300000)) { // 3 attempts per 5 minutes
    throw new functions.https.HttpsError('resource-exhausted', 'Too many password reset attempts');
  }
  
  try {
    // Generate password reset link
    const resetLink = await admin.auth().generatePasswordResetLink(email);
    
    // Log security event
    await admin.firestore().collection('security_logs').add({
      type: 'password_reset_requested',
      email,
      ip: clientIP,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    console.error('Password reset error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send password reset email');
  }
});

// Audit log for admin actions
exports.auditLog = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const userId = context.params.userId;
    
    // Check if role changed
    if (before.role !== after.role) {
      await admin.firestore().collection('audit_logs').add({
        type: 'role_change',
        userId,
        oldRole: before.role,
        newRole: after.role,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        changedBy: after.updatedBy || 'system'
      });
    }
    
    // Check if plan changed
    if (before.plan !== after.plan) {
      await admin.firestore().collection('audit_logs').add({
        type: 'plan_change',
        userId,
        oldPlan: before.plan,
        newPlan: after.plan,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });

// Health check endpoint
exports.healthCheck = functions.https.onRequest((req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
