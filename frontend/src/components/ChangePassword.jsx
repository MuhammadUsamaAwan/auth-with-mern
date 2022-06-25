import { useState } from 'react'
import useAxios from '../hooks/useAxios'
import useAuth from '../hooks/useAuth'

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [response, error, loading, sentLink] = useAxios()
  const { auth } = useAuth()
  const handleSubmit = e => {
    e.preventDefault()
    sentLink({
      method: 'POST',
      url: 'changepassword',
      requestConfig: {
        currentPassword,
        newPassword,
      },
    })
  }
  return (
    <section>
      <h1 className='text-center'>Change Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          className='form-control mb-2'
          style={{ width: '20rem' }}
          type='password'
          placeholder='Current Password'
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
        />
        <input
          className='form-control mb-2'
          type='password'
          placeholder='New Password'
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
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
            Change
          </button>
        </div>
      </form>
    </section>
  )
}

export default ChangePassword
