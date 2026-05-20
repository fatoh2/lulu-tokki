import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAx3RL4nt83Jc_4ykvI3SdLR6vFWiNQlkI",
  authDomain: "korean-snacks.firebaseapp.com",
  projectId: "korean-snacks",
  storageBucket: "korean-snacks.firebasestorage.app",
  messagingSenderId: "914383758279",
  appId: "1:914383758279:web:726ff976cfcc8db5422fe2",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
