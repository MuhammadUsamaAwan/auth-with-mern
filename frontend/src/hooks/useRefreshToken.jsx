import axios from '../api/axios'
import { BASE_URL } from '../config/config'
import useAuth from './useAuth'

const useRefreshToken = () => {
  const { setAuth } = useAuth()

  const refresh = async () => {
    const response = await axios.post(BASE_URL + 'refresh', {})
    setAuth(prev => ({ ...prev, accessToken: response.data.accessToken }))
    return response.data.accessToken
  }
  return refresh
}

export default useRefreshToken
