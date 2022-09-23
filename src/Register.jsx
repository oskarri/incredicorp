import {useState} from 'react'
import {auth, db} from './firebase.js'
import {useNavigate, Link} from 'react-router-dom'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

function Register() {

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
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
            name: name,
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
      <div className='auth flex flex-col gap-3 h-full justify-start'>
        <h1 className='text-3xl font-semibold'>Register</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={register} name='registration_form' className='flex flex-col gap-2 mt-2'>
          <input 
            type='email' 
            value={email}
            placeholder="Enter your email"
            required
            className='shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            onChange={e => setEmail(e.target.value)}/>
          <input 
            type='name' 
            value={name}
            placeholder="Enter your Name"
            required
            className='shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            onChange={e => setName(e.target.value)}/>
          <input 
            type='password'
            value={password} 
            required
            placeholder='Enter your password'
            className='shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            onChange={e => setPassword(e.target.value)}/>

          <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Register</button>
        </form>
        <span className='text-sm'>
          Already have an account?  
          <Link to='/login' className=' ml-1 inline-block px-3 py-1 border-2 border-green-600 text-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>login</Link>
        </span>
      </div>
  )
}

export default Register