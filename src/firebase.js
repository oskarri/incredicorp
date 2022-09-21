import { initializeApp } from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC2gsYZ52nbw4XodvhJEIZPrItqsJOHFpE",
  authDomain: "be-61be5.firebaseapp.com",
  projectId: "be-61be5",
  storageBucket: "be-61be5.appspot.com",
  messagingSenderId: "1037477194727",
  appId: "1:1037477194727:web:644dac00a57a637f342b42",
  measurementId: "G-PQ4W2QG90Y"
}

// Initialize Firebase and Firebase Authentication
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app);

export {auth, db}