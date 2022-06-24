import { useState, useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../config/config'

const useAxios = () => {
  const [response, setResponse] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [controller, setController] = useState()

  const axiosFetch = async configObj => {
    const { method, url, requestConfig = {} } = configObj

    try {
      setLoading(true)
      const ctrl = new AbortController()
      setController(ctrl)
      const res = await axios[method.toLowerCase()](BASE_URL + url, {
        ...requestConfig,
        signal: ctrl.signal,
      })
      setError('')
      setResponse(res.data)
    } catch (err) {
      setResponse('')
      setError(err.response.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // useEffect cleanup function
    return () => controller && controller.abort()
  }, [controller])

  return [response, error, loading, axiosFetch]
}

export default useAxios
