import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig={
    apiKey: "AIzaSyCXw3tRokoIHDisnbRl6gumV6EK5LC_HOo",
    authDomain: "entrega-final-62dd0.firebaseapp.com",
    projectId: "entrega-final-62dd0",
    storageBucket: "entrega-final-62dd0.firebasestorage.app",
    messagingSenderId: "985999848274",
    appId: "1:985999848274:web:ca4a01e4cda03099b1c08b"
}


const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const db= getFirestore(app)