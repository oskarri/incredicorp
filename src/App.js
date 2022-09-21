import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Form from './form';
import Login from './Login';
import Register from './Register';
import { auth, db } from './firebase';
import { AuthProvider } from './AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import Profile from './Profile';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
;

// Initialize Firebase






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
        const qtwo = query(collection(db, "Posts"), where("visibility", "==", userDB.data().pardent));
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
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
      const getUser = async () => {
        console.log(user.uid)
        const userDB = await getDoc(doc(db, 'Users', user.uid))
        return userDB
      }
      getUser().then((user) => {
        setCurrentUser(user)
      })
     }
     else {
      setCurrentUser(null)
     }})
  }, [])

  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    console.log(currentUser)
  }, [currentUser])
  return (
    <AuthProvider value={{currentUser}}>
      <div className="flex flex-col h-screen">
        <header className="w-full h-12 bg-slate-700 text-white grow-0">
          <span className='text-left'>Be Work</span>
          <span className='text-right'>{currentUser ? currentUser.data().email : "please login"}</span>
        </header>
        <div className='grow place-content-center'>
          <Router>
              <Routes>
                <Route exact path='/' element={<Login/>}/>
                <Route exact path='/register' element={
                  !currentUser ? 
                    <Register/>
                    : <Navigate to='/success' replace/>
                  }/>
                <Route exact path='/login' element={
                  !currentUser ? 
                    <Login/>
                    : <Navigate to='/success' replace/>
                  }/>
                <Route exact path='/success' element={<Profile/>}/>
              </Routes>
          </Router>
        </div>
      </div >
    </AuthProvider>
  );
}

export default App;
