const express=require('express');
const firebase=require('firebase/app')

const {getStorage,ref, uploadBytes}=require('firebase/storage')

const firebaseConfig = {
    apiKey: "Your-id",
    authDomain: "Your-id",
    projectId: "Your-id",
    storageBucket: "Your-id",
    messagingSenderId: "Your-id",
    appId: "Your-id"
  };


module.exports=firebase.initializeApp(firebaseConfig);

// const storage=getStorage();
// const upload=multer({storage:multer.memoryStorage()});

