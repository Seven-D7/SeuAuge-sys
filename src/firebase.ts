import { initializeApp } from "firebase/app";

// Firebase será usado apenas para hospedagem
// A autenticação e banco de dados serão através do Supabase

// Validate required environment variables for production hosting
const requiredEnvVars = [
  'VITE_FIREBASE_PROJECT_ID',
];

// Check for missing environment variables in production
if (import.meta.env.PROD) {
  const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  if (missingVars.length > 0) {
    console.warn(`Firebase hosting: Missing environment variables: ${missingVars.join(', ')}`);
  }
}

// Minimal Firebase configuration for hosting only
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

// Demo mode detection - Firebase em modo demo quando não tem configuração real
const isDemoMode = !import.meta.env.PROD && firebaseConfig.apiKey === "demo-api-key";

if (isDemoMode) {
  console.warn(
    "🔧 Firebase em modo DEMO - Usando Supabase como backend principal",
  );
}

// Initialize Firebase app for hosting
const app = initializeApp(firebaseConfig);

// Nota: Não inicializamos auth, firestore ou storage porque usaremos Supabase
// export { auth, db, storage } - Removidos intencionalmente

export { isDemoMode };
export default app;
