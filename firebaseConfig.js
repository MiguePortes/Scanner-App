import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHMi5B0ZXe9krkGk3J-BCWZp-E4tSBr5w",
  authDomain: "scanner-app-e7de7.firebaseapp.com",
  projectId: "scanner-app-e7de7",
  storageBucket: "scanner-app-e7de7.firebasestorage.app",
  messagingSenderId: "1062736397104",
  appId: "1:1062736397104:web:611be98c8963c903277ef5",
  measurementId: "G-QF0QH996KW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
