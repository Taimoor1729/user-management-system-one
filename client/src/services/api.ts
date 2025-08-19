import axios from 'axios'

const BASE = 'http://localhost:4000/api'

const instance = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default instance
