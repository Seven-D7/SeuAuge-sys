import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDttKYZ1bQEzEzK43y1qQo8z9g3cG-N2Ss",
  authDomain: "seuaugesys.firebaseapp.com",
  projectId: "seuaugesys",
  storageBucket: "seuaugesys.appspot.com",
  messagingSenderId: "359671420554",
  appId: "1:359671420554:web:86208860508a4db80a7f73",

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

export default app;
