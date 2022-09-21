import {useState} from 'react'
import {auth, db} from './firebase.js'
import {useNavigate, Link} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

function Register() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const register = (e) => {
    e.preventDefault()
    setError('')
    // Create a new user with email and password using firebase
    createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {

        //TODO: Create entry in User Database
        console.log("created user", user.user.uid)
        const createUser = async () => {
          await setDoc(doc(db, "Users", user.user.uid), {
            name: "Placeholder",
            email: user.user.email,
            role: 'member',
          })
        }
        createUser()
        
    })
    .catch(err => setError(err.message))
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
      <div className='auth flex flex-col gap-3 h-full'>
        <h1>Register</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={register} name='registration_form' className='flex flex-col gap-2'>
          <input 
            type='email' 
            value={email}
            placeholder="Enter your email"
            required
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password} 
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

            <input 
            type='password'
            value={confirmPassword} 
            required
            placeholder='Confirm password'
            onChange={e => setConfirmPassword(e.target.value)}/>

          <button type='submit'>Register</button>
        </form>
        <span>
          Already have an account?  
          <Link to='/login'>login</Link>
        </span>
      </div>
  )
}

export default Register