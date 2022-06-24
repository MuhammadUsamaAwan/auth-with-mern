import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAxios from '../hooks/useAxios'

const VerifyEmail = () => {
  const params = useParams()
  const [response, error, loading, verify] = useAxios()
  useEffect(() => {
    verify({
      method: 'POST',
      url: 'verify',
      requestConfig: {
        token: params.token,
      },
    })
    console.log(response)
    console.log(error)
    console.log(loading)
  }, [])
  if (loading) return <p>Please Wait...</p>
  return (
    <>
      {response && (
        <p className='text-success'>
          {response.message} (please login to continue)
        </p>
      )}
      {error && (
        <p className='text-danger'>
          {error.message} (most likely the link expired)
        </p>
      )}
    </>
  )
}

export default VerifyEmail
