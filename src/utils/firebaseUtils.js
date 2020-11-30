import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBcxEmCjr9ZZ8Ok-0Vvw5BoHR4AIAa84Go",
  authDomain: "sustentabilidade-empresarial.firebaseapp.com",
  databaseURL: "https://sustentabilidade-empresarial.firebaseio.com",
  projectId: "sustentabilidade-empresarial",
  storageBucket: "sustentabilidade-empresarial.appspot.com",
  messagingSenderId: "782236114999",
  appId: "1:782236114999:web:49b8d073d4559d9d9fdfb2",
  measurementId: "G-HV4HTBHNBF"
};

export function firebaseImpl() {
  firebase.initializeApp(config);
}

export function firebaseCheckToken() {
  return new Promise((resolve, reject) => {
     const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
     }, reject);
  });
}
