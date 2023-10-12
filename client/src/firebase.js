
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDup0GLTCC1lh5EdCh7Huwxq-L-qHK_jZ4",
  authDomain: "major-de7cb.firebaseapp.com",
  projectId: "major-de7cb",
  storageBucket: "major-de7cb.appspot.com",
  messagingSenderId: "669303032134",
  appId: "1:669303032134:web:a1893e7935cd5838f83d47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Authentication
export const auth = getAuth(app);
var provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt:"select_account"
});

// Initialize Firestore
// export const firestore = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// export const db=getFirestore(app);


export {provider};
export default app;
