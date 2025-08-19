import { useEffect, useState } from 'react'
import { me } from '../services/auth'
import Navbar from '../components/Navbar'

export default function Profile(){
  const [data, setData] = useState<any>(null)
  useEffect(()=>{ me().then(setData).catch(()=>setData(null)) }, [])
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <div className="bg-white rounded p-4 shadow">
          <h2 className="text-xl font-semibold">My Profile</h2>
          {!data ? <div className="py-4">Loading...</div> : (
            <div className="mt-2">
              <div><b>Name:</b> {data.name}</div>
              <div><b>Email:</b> {data.email}</div>
              <div><b>Role:</b> {data.role?.name ?? '—'}</div>
            </div>
          )}
        </div>
        <div className="bg-white rounded p-4 shadow">
          <h3 className="font-semibold">Effective Permissions</h3>
          <ul className="list-disc ml-6 mt-2">
            {data?.effectivePermissions?.map((p:string)=> <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
