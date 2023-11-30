// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCxbGhvMPMrxqgRn4kITXk5YnK6rMvokAw',
  authDomain: 'napoleao-web.firebaseapp.com',
  projectId: 'napoleao-web',
  storageBucket: 'napoleao-web.appspot.com',
  messagingSenderId: '723191971457',
  appId: '1:723191971457:web:64703f61d5e2c955fc9780',
  measurementId: 'G-X7DLHB7F10',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
