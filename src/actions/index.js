import { signInWithPopup } from "firebase/auth";
import {ref,uploadBytesResumable} from 'firebase/storage';
import { SET_USER ,SET_LOADING_STATUS,GET_ARTICLES} from "./actionType";
import {auth,provider,storage} from '../firebase';
import {db} from '../firebase' 
import { collection, addDoc,setDoc} from "firebase/firestore"; 
import { getDownloadURL } from 'firebase/storage';
import {  query, orderBy, onSnapshot } from 'firebase/firestore';

export const setUser=(payload)=>({
    type:SET_USER,
    user:payload,
})
export const setLoading=(status)=>({
  type:SET_LOADING_STATUS,
  status:status,
})
export const getArticles=(payload)=>({
    type:GET_ARTICLES,
    payload:payload,
  });
export function signInAPI(){
    return (disptach)=>{
        signInWithPopup(auth,provider)
        .then((payload)=>{
            console.log(payload);
        })
        .catch((err)=>{
            console.log(err.message)
        })
    }
}

export function getArticleAPI() {
    return (dispatch) => {
      const articlesCollectionRef = collection(db, 'articles'); // Reference to the 'articles' collection
  
      // Create a query to order the documents by 'actor.date' in descending order
      const q = query(articlesCollectionRef, orderBy('actor.date', 'desc'));
  
      // Attach an 'onSnapshot' listener to the query
      // This will fetch articles whenever there are changes in the collection
      onSnapshot(q, (snapshot) => {
        const payload = snapshot.docs.map((doc) => doc.data());
        console.log(payload);
        dispatch(getArticles(payload)); // Dispatch the action with fetched articles
      });
    };
  }


  
export function postArticleAPI(payload) {
  return async (dispatch) => {
    dispatch(setLoading(true))

    if (payload.image !== '') {
      const storageRef = ref(storage, `images/${payload.image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, payload.image);

      try {
        const snapshot = await uploadTask;
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progress: ${progress}%`);

        const downloadURL = await getDownloadURL(snapshot.ref);

        // Add data to Firestore
        const articlesCollectionRef = collection(db, 'articles');
        await addDoc(articlesCollectionRef, {
          actor: {
            description: payload.user.email,
            title: payload.user.displayName,
            date: payload.timestamp,
            image: payload.user.photoURL,
          },
          video: payload.video,
          shareImg: downloadURL,
          comments: 0,
          description: payload.description,
        });
        dispatch(setLoading(false));

        console.log('Document added to Firestore');
        // You can dispatch an action here if needed
        // For example, dispatch a success action with the downloadURL
        // dispatch({ type: 'UPLOAD_SUCCESS', downloadURL });
      } catch (error) {
        console.error('Error:', error);
      }
    }else if(payload.video){
      const articlesCollectionRef = collection(db, 'articles');
        await addDoc(articlesCollectionRef, {
          actor: {
            description: payload.user.email,
            title: payload.user.displayName,
            date: payload.timestamp,
            image: payload.user.photoURL,
          },
          video: payload.video,
          shareImg: "",
          comments: 0,
          description: payload.description,
        });
        dispatch(setLoading(false));
    }
  };
}