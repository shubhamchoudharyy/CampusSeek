
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "Your-id",
  authDomain: "Your-id",
  projectId: "Your-id",
  storageBucket: "Your-id",
  messagingSenderId: "Your-id",
  appId: "Your-id"
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
