// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔧 Substitua pelos dados reais do seu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDttKYZ1bQEzEzK43y1qQo8z9g3cG-N2Ss",
  authDomain: "seuaugesys.firebaseapp.com",
  projectId: "seuaugesys",
  storageBucket: "seuaugesys.firebasestorage.app",
  messagingSenderId: "359671420554",
  appId: "1:359671420554:web:86208860508a4db80a7f73",
  measurementId: "G-XHQWK84959"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que você vai usar
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
