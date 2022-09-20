import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";


import Form from './form';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2gsYZ52nbw4XodvhJEIZPrItqsJOHFpE",
  authDomain: "be-61be5.firebaseapp.com",
  projectId: "be-61be5",
  storageBucket: "be-61be5.appspot.com",
  messagingSenderId: "1037477194727",
  appId: "1:1037477194727:web:644dac00a57a637f342b42",
  measurementId: "G-PQ4W2QG90Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);





function App() {
  const [user, setUser] = useState(null)
  const [posts,setPosts] = useState([])
  useEffect(() => {
    if(user) {
      console.log("email:", user.email)
      const q = query(collection(db, "Users"), where("email", "==", user.email));
      let userDB = null
      const getData = async () => {
        const querySnapshot = await getDocs(q);
        userDB = querySnapshot.docs[0]
        console.log(userDB.data())
        const qtwo = query(collection(db, "Posts"), where("visibility", "==", userDB.data().parent));
        const querySnapshotTwo = await getDocs(qtwo);
        setPosts(querySnapshotTwo.docs)
        querySnapshotTwo.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
        });
      }
      getData()
    }
  }, [user])
  useEffect(() => {

  }, [posts])
  return (

    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        {
          !user && (
            <Form setUser={setUser}/>
          )
        }
        {
          (user && posts.length!==0) && (
              <div>
                {
                  posts.map((doc) => {
                    return(
                      <img src={doc.data().src} alt="test"/>
                    )
                  })
                }
              </div>
            )
        }
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div >
  );
}

export default App;
