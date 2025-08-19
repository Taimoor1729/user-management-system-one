import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function LoginPage(){
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('Admin@123')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const data = await login(email, password)
      await localStorage.setItem('token', data.token)
      navigate('/')
    } catch (err:any) {
      alert(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form onSubmit={handle} className="bg-white rounded-2xl shadow p-8 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-2">{loading ? 'Signing in...' : 'Sign in' }</button>
      </form>
    </div>
  )
}
