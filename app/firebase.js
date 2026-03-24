import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCpZb8GS6bzJWf82P-L5cG1GPSg0yK7aqY",
  authDomain: "famille-carrier-68a77.firebaseapp.com",
  projectId: "famille-carrier-68a77",
  storageBucket: "famille-carrier-68a77.firebasestorage.app",
  messagingSenderId: "331362389245",
  appId: "1:331362389245:web:aaa91c7f0c1693d3b20294",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);