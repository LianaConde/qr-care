import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA36Vk_MyH6sDfwIKI0utfPAniNF6vyOwY",
  authDomain: "qr-care-ab2f7.firebaseapp.com",
  projectId: "qr-care-ab2f7",
  storageBucket: "qr-care-ab2f7.appspot.com",
  messagingSenderId: "887410624852",
  appId: "1:887410624852:web:e0f63be7574eb82260a0c1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);