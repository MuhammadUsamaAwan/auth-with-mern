import { useState } from 'react'
import useAxios from '../hooks/useAxios'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, error, loading, signup] = useAxios()
  const handleSubmit = e => {
    e.preventDefault()
    signup({
      method: 'POST',
      url: 'signup',
      requestConfig: {
        name,
        email,
        password,
      },
    })
  }
  return (
    <section>
      <h1 className='text-center'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          className='form-control mb-2'
          style={{ width: '20rem' }}
          type='text'
          placeholder='Name'
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className='form-control mb-2'
          type='email'
          placeholder='Email Address'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className='form-control mb-2'
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className='text-danger text-center mb-2'>{error.message}</p>
        )}
        {response && (
          <p className='text-success text-center mb-2'>{response.message}</p>
        )}
        <div className='d-grid'>
          <button
            type='submit'
            className='btn btn-primary block'
            disabled={loading}
          >
            Sign Up
          </button>
        </div>
      </form>
    </section>
  )
}

export default Signup
