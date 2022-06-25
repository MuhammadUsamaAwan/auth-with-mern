import useAuth from './useAuth'
import useAxios from './useAxios'

const useRefreshToken = () => {
  const [response, error, loading, refreshRequest] = useAxios()
  const { setAuth } = useAuth()

  const refresh = async () => {
    refreshRequest({
      method: 'POST',
      url: 'refresh',
    })
    if (response)
      setAuth(auth => ({ ...auth, accessToken: response.accessToken }))
    console.log(response.accessToken)
    return response.accessToken
  }
  return refresh
}

export default useRefreshToken
