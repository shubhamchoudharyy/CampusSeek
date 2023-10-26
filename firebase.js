const express=require('express');
const firebase=require('firebase/app');
const GoogleAuthProvider=require('firebase/auth');

const {getStorage,ref, uploadBytes}=require('firebase/storage')

const firebaseConfig = {
  apiKey: "AIzaSyDup0GLTCC1lh5EdCh7Huwxq-L-qHK_jZ4",
  authDomain: "major-de7cb.firebaseapp.com",
  projectId: "major-de7cb",
  storageBucket: "major-de7cb.appspot.com",
  messagingSenderId: "669303032134",
  appId: "1:669303032134:web:a1893e7935cd5838f83d47"
};


module.exports=firebase.initializeApp(firebaseConfig);

// const storage=getStorage();
// const upload=multer({storage:multer.memoryStorage()});

