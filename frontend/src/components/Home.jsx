import { useEffect } from 'react'
import useAxios from '../hooks/useAxios'
import useAxiosPrivate from '../hooks/useAxiosPrivate'

const Home = () => {
  const [response, error, loading, getUser] = useAxios()
  const axiosPrivate = useAxiosPrivate()
  useEffect(() => {
    getUser({
      method: 'GET',
      url: 'user',
      axiosInstance: axiosPrivate,
    })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Somthing went wrong</p>
  return (
    <section>
      <h1 className='text-center'>I'm In</h1>
      <ul className='list-group'>
        <li className='list-group-item'>Name: {response?.user?.name}</li>
        <li className='list-group-item'>Email: {response?.user?.email}</li>
        <li className='list-group-item'>Joined: {response?.user?.createdAt}</li>
      </ul>
    </section>
  )
}

export default Home
