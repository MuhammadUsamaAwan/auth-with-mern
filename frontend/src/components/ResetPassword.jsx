import { useState } from 'react'
import { useParams } from 'react-router-dom'
import useAxios from '../hooks/useAxios'

const ResetPassword = () => {
  const params = useParams()
  const [password, setPassword] = useState('')
  const [response, error, loading, sentLink] = useAxios()
  const handleSubmit = e => {
    e.preventDefault()
    sentLink({
      method: 'POST',
      url: 'resetpassword',
      requestConfig: {
        password,
        token: params.token,
      },
    })
  }
  return (
    <section>
      <h1 className='text-center'>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          className='form-control mb-2'
          style={{ width: '20rem' }}
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className='text-danger text-center m-2'>{error.message} </p>
        )}
        {response && (
          <p className='text-success text-center mb-2'>{response.message}</p>
        )}
        <div className='d-grid'>
          <button type='submit' className='btn btn-primary' disabled={loading}>
            Reset
          </button>
        </div>
      </form>
    </section>
  )
}

export default ResetPassword
