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
        <h1>Log in</h1>
        {error && <div className='auth__error'>{error}</div>}
        <form onSubmit={login} name='login_form ' className='flex flex-col gap-2'>
          <input 
            type='email' 
            value={email}
            required
            placeholder="Enter your email"
            onChange={e => setEmail(e.target.value)}/>

          <input 
            type='password'
            value={password}
            required
            placeholder='Enter your password'
            onChange={e => setPassword(e.target.value)}/>

          <button type='submit'>Login</button>
        </form>
        <p>
          Don't have and account? 
          <Link to='/register'>Create one here</Link>
        </p>
      </div>
  )
}

export default Login