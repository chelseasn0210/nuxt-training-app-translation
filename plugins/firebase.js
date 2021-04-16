import firebase from 'firebase'
import "firebase/storage";
import 'firebase/database';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyD1ft0XP1fOeDuoow4B59CTU-lzxeLBVFA",
    authDomain: "tranig-app.firebaseapp.com",
    databaseURL: "https://tranig-app-default-rtdb.firebaseio.com",
    projectId: "tranig-app",
    storageBucket: "tranig-app.appspot.com",
    messagingSenderId: "297568485272",
    appId: "1:297568485272:web:999d945a3e0861f2c5b5ed",
  })
}

export default firebase