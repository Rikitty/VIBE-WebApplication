import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import dotenv from "dotenv";

dotenv.config();

const FIREBASE_CONFIGURATION = process.env.FIREBASE_CONFIGURATION || "";

// Parse the Firebase configuration
const firebaseConfig: FirebaseOptions = JSON.parse(
  FIREBASE_CONFIGURATION as string
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Firebase Auth services
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
