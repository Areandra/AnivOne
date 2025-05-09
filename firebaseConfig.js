import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBV9s9VNkciwYz0Qtm7mShWoC7b6nu3Uz0",
  authDomain: "anivone-f0de2.firebaseapp.com",
  projectId: "anivone-f0de2",
  storageBucket: "anivone-f0de2.firebasestorage.app",
  messagingSenderId: "959824899112",
  appId: "1:959824899112:web:4175e154bf9d3000ea991d",
  measurementId: "G-NTWG7E98D0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };