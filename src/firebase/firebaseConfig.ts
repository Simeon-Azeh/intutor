import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";  // Import signOut along with getAuth
import { getFirestore } from "firebase/firestore"; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBjZPKeW01BMolVfTGUfFo69k5SxBC3hOU",
  authDomain: "intutor-7cd24.firebaseapp.com",
  projectId: "intutor-7cd24",
  storageBucket: "intutor-7cd24.firebasestorage.app",
  messagingSenderId: "434506023117",
  appId: "1:434506023117:web:267e7c4c937a7eed2a6984",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Export signOut function
export { signOut }; // Export signOut for use in your components
