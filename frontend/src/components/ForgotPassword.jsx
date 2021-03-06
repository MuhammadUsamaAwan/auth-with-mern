import { useState } from 'react'
import useAxios from '../hooks/useAxios'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [response, error, loading, sentLink] = useAxios()
  const handleSubmit = e => {
    e.preventDefault()
    sentLink({
      method: 'POST',
      url: 'resetpasswordlink',
      requestConfig: {
        email,
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
          type='email'
          placeholder='Email Address'
          value={email}
          onChange={e => setEmail(e.target.value)}
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
            Sent Link
          </button>
        </div>
      </form>
    </section>
  )
}

export default ForgotPassword
