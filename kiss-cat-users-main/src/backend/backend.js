import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCOA_ImU_3XQSVLx_UdJmg6qwAfD_NuyQ0",
    authDomain: "kiss-cat-hotel.firebaseapp.com",
    projectId: "kiss-cat-hotel",
    storageBucket: "kiss-cat-hotel.appspot.com",
    messagingSenderId: "893199611831",
    appId: "1:893199611831:web:f94eb0a536362dc4d45a32",
    measurementId: "G-85QM2MEEJ5"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase };