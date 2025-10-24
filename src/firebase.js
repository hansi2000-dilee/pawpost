import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCvW39GV_t4FHghWKPZO3F-DucXY7O5rZ0",
  authDomain: "pawpost-65122967-e0a4b.firebaseapp.com",
  databaseURL: "https://pawpost-65122967-e0a4b-default-rtdb.firebaseio.com",
  projectId: "pawpost-65122967-e0a4b",
  storageBucket: "pawpost-65122967-e0a4b.firebasestorage.app",
  messagingSenderId: "324169955087",
  appId: "1:324169955087:web:0d5874c4882f8f7724307a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, storage, database };
