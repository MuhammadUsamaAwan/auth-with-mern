import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAxios from '../hooks/useAxios'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [response, error, loading, login] = useAxios()
  const [resentResponse, resentError, resentLoading, resent] = useAxios()
  const { setAuth } = useAuth()
  const handleSubmit = e => {
    e.preventDefault()
    login({
      method: 'POST',
      url: 'login',
      requestConfig: {
        email,
        password,
      },
    })
  }
  useEffect(() => {
    if (response.accessToken) {
      setAuth(response)
      navigate('/')
    }
  }, [response])

  const resentEmail = () => {
    resent({
      method: 'POST',
      url: 'resent',
      requestConfig: {
        email,
      },
    })
  }
  return (
    <section>
      <h1 className='text-center'>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          className='form-control mb-2'
          style={{ width: '20rem' }}
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
          <div className='mb-2'>
            <p className='text-danger text-center m-0'>{error.message} </p>
            {error.message === 'Email not verified' && (
              <div className='d-grid'>
                <button
                  type='button'
                  className='btn btn-link p-0'
                  disabled={resentLoading}
                  onClick={resentEmail}
                >
                  Resent Email
                </button>
              </div>
            )}
            {resentError && (
              <p className='text-danger text-center m-0'>
                {resentError.message}
              </p>
            )}
            {resentResponse && (
              <p className='text-success text-center m-0'>
                {resentResponse.message}
              </p>
            )}
          </div>
        )}
        {response && (
          <p className='text-success text-center mb-2'>{response.message}</p>
        )}
        <div className='d-grid'>
          <button type='submit' className='btn btn-primary' disabled={loading}>
            Login
          </button>
        </div>
      </form>
    </section>
  )
}

export default Login
