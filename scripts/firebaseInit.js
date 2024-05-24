import "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
//import "https://www.gstatic.com/firebasejs/4.12.1/firebase.js";
// Initialize Firebase
const config = {
    apiKey: "AIzaSyD9DKwr7qp-QJHCVegItvSDktSuR48yuJI",
    authDomain: "musicalmemoirs-f35ba.firebaseapp.com",
    databaseURL: "https://musicalmemoirs-f35ba-default-rtdb.firebaseio.com",
    projectId: "musicalmemoirs-f35ba",
    storageBucket: "musicalmemoirs-f35ba.appspot.com",
    messagingSenderId: "1008437474417",
    appId: "1:1008437474417:web:05075de89f9a038b8217d0",
    measurementId: "G-PVM7TH88DH"
};
firebase.initializeApp(config);

firebase.auth().useDeviceLanguage();

const Ref = firebase.database().ref();
const inqRef = firebase.database().ref().child("Inquiries");