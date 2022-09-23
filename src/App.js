import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react"
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth"
import Form from './form';
import Login from './Login';
import Register from './Register';
import { auth, db } from './firebase';
import { AuthProvider } from './AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import Profile from './Profile';
import Posts from './Posts';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
;

// Initialize Firebase






function App() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  useEffect(() => {
    if (user) {
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
      if (user) {
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
      }
    })
  }, [])

  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    console.log(currentUser)
  }, [currentUser])
  return (
    <AuthProvider value={{ currentUser }}>
      <div className="flex flex-col h-screen">
        <header className="w-full h-max bg-slate-700 text-white grow-0 flex flex-row justify-between items-center py-5 px-5">
          <span className='font-semibold text-2xl'>BeWork</span>
          <div>
            {currentUser ? (
              <div>
                <span onClick={() => {
                  signOut(auth)
                }}
                  className='ml-1 inline-block px-3 ml-16 py-1 border-2 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                  Sign out
                </span>
                <span className=''>{currentUser ? currentUser.data().email : "please login"}</span>
              </div>
            ) : (<span>Please login</span>)}
          </div>

        </header>
        <div className='grow place-content-center flex flex-row justfiy-between'>
          <div className=' h-max w-max my-24 p-4 rounded-md border-slate-300 border-2'>
            <Router>
              <Routes>
                <Route exact path='/' element={<Login />} />
                <Route exact path='/register' element={
                  !currentUser ?
                    <Register />
                    : <Navigate to='/success' replace />
                } />
                <Route exact path='/posts' element={
                  currentUser &&
                  <Posts />
                } />
                <Route exact path='/login' element={
                  <Login />
                } />
                <Route exact path='/success' element={<Profile />} />
              </Routes>
            </Router>
          </div>

        </div>
      </div >
    </AuthProvider>
  );
}

export default App;
