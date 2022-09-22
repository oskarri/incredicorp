import {useState} from 'react'
import { Link } from 'react-router-dom'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from './firebase.js'
import {useNavigate} from 'react-router-dom'


function Login(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = e => {
    e.preventDefault()
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      navigate('/success')
    })
    .catch(err => setError(err.message))
  }

  return(
      <div className='auth flex flex-col justify-start h-full gap-3'>
        <h1 className='text-3xl font-semibold'>Log in to BeWork</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={login} name='login_form ' className='flex flex-col gap-2 mt-2'>
          <input 
            type='email' 
            value={email}
            required
            className='shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder="Enter your email"
            onChange={e => setEmail(e.target.value)}/>
          <input 
            type='password'
            value={password}
            required
            className='shadow appearance-none border rounded w-full my-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

          <button type='submit' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Login</button>
        </form>
        <span className='text-sm'>
          Don't have an account? 
          <Link to='/register' className=' ml-1 inline-block px-3 py-1 border-2 border-red-600 text-red-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>Register</Link>
        </span>
      </div>
  )
}

export default Login