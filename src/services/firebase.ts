import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDttKYZ1bQEzEzK43y1qQo8z9g3cG-N2Ss",
  authDomain: "seuaugesys.firebaseapp.com",
  projectId: "seuaugesys",
  storageBucket: "seuaugesys.firebasestorage.app",
  messagingSenderId: "359671420554",
  appId: "1:359671420554:web:86208860508a4db80a7f73",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; // 👈 Isso que estava faltando

export default app;
