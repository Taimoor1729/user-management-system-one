import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ title='RBAC Admin' }:{ title?: string }){
  const navigate = useNavigate()
  return (
    <div className="w-full bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold">{title}</h1>
        <div className="flex gap-2">
          {/* <button onClick={()=>navigate('/profile')} className="text-sm px-3 py-1 rounded hover:bg-gray-100">Profile</button> */}
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </div>
    </div>
  )
}
