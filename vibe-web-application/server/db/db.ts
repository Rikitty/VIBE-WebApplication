import { FirebaseOptions, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from 'dotenv';


dotenv.config();
const FIREBASE_CONFIGURATION = process.env.FIREBASE_CONFIGURATION || '';

const firebaseConfig: FirebaseOptions = 
    JSON.parse(FIREBASE_CONFIGURATION as string);


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);