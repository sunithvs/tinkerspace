// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNCXGNX7VdLgW__ez5dT0K375ukHEMRcs",
    authDomain: "tinkerspace-13a3e.firebaseapp.com",
    databaseURL: "https://tinkerspace-13a3e-default-rtdb.firebaseio.com",
    projectId: "tinkerspace-13a3e",
    storageBucket: "tinkerspace-13a3e.appspot.com",
    messagingSenderId: "1086471057773",
    appId: "1:1086471057773:web:909884001b076a20882a64",
    measurementId: "G-QTG4MHCP5L"
};

// Initialize Firebase

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth();

export {auth};
export const db = getFirestore(app);