import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { listUsers, createUser, assignRole, setOverrides } from '../services/users'
import { listRoles, createRole, editRolePerms } from '../services/roles'
import { listPermissions, createPermission } from '../services/permissions'

export default function Dashboard(){
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [perms, setPerms] = useState<any[]>([])

  const refresh = async () => {
    try{
      const [u,r,p] = await Promise.all([listUsers(), listRoles(), listPermissions()])
      setUsers(u); setRoles(r); setPerms(p)
    }catch(err:any){
      alert(err?.response?.data?.message || 'Failed to load')
    }
  }

  useEffect(()=>{ refresh() }, [])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Users</h2>
          <UserCreate onCreate={async (payload)=>{ await createUser(payload); await refresh() }} />
          <div className="mt-4 space-y-3">
            {users.map(u=>(
              <div key={u._id} className="border rounded-xl p-3">
                <div className="font-medium">{u.name} <span className="text-gray-500 text-sm">({u.email})</span></div>
                <div className="text-sm">Role: {u.role?.name ?? '—'}</div>
                <div className="mt-2 flex gap-2">
                  <select id={"role-"+u._id} className="border rounded px-2 py-1">
                    <option value="">-- select role --</option>
                    {roles.map(r=> <option key={r._id} value={r._id}>{r.name}</option>)}
                  </select>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={async ()=>{
                    const el = document.getElementById('role-'+u._id) as HTMLSelectElement
                    if(!el.value) return alert('Pick a role')
                    await assignRole(u._id, el.value)
                    await refresh()
                  }}>Assign Role</button>
                </div>
                <div className="mt-2 flex gap-2">
                  <select id={"perm-"+u._id} className="border rounded px-2 py-1">
                    <option value="">-- select permission --</option>
                    {perms.map(p=> <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={async ()=>{
                    const el = document.getElementById('perm-'+u._id) as HTMLSelectElement
                    if(!el.value) return alert('Pick a permission')
                    await setOverrides(u._id, [el.value], [])
                    await refresh()
                  }}>Add Override</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Roles & Permissions</h2>
          <RoleCreate onCreate={async (name)=>{ await createRole({name}); await refresh() }} />
          <PermCreate onCreate={async (name)=>{ await createPermission({name}); await refresh() }} />

          <div className="mt-4 space-y-3">
            {roles.map(r=>(
              <div key={r._id} className="border rounded-xl p-3">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm">Perms: {(r.permissions ?? []).map((p:any)=>p.name).join(', ') || '—'}</div>
                <div className="mt-2 flex gap-2">
                  <select id={"rperm-"+r._id} className="border rounded px-2 py-1">
                    <option value="">-- select permission --</option>
                    {perms.map(p=> <option key={p._1d} value={p._id}>{p.name}</option>)}
                  </select>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={async ()=>{
                    const el = document.getElementById('rperm-'+r._id) as HTMLSelectElement
                    if(!el.value) return alert('Pick a permission')
                    await editRolePerms(r._id, [el.value], [])
                    await refresh()
                  }}>Add to Role</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function UserCreate({ onCreate }:{ onCreate:(p:{name:string;email:string;password:string})=>Promise<void> }){
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  return (
    <form className="flex flex-col gap-2" onSubmit={async e=>{ e.preventDefault(); await onCreate({name,email,password}); setName(''); setEmail(''); setPassword('') }}>
        <div className='flex'>
      <input className="border rounded px-3 py-2 w-28" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="border rounded px-3 py-2 w-56" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2 w-40" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
      <button className="px-3 py-2 bg-black text-white rounded">Create</button>
    </form>
  )
}

function RoleCreate({ onCreate }:{ onCreate:(name:string)=>Promise<void> }){
  const [name,setName]=useState('')
  return (
    <form className="flex gap-2 mt-2" onSubmit={async e=>{ e.preventDefault(); if(!name) return; await onCreate(name); setName('') }}>
      <input className="border rounded px-3 py-2 w-64" placeholder="New Role Name" value={name} onChange={e=>setName(e.target.value)} />
      <button className="px-3 py-2 bg-black text-white rounded">Create Role</button>
    </form>
  )
}

function PermCreate({ onCreate }:{ onCreate:(name:string)=>Promise<void> }){
  const [name,setName]=useState('')
  return (
    <form className="flex gap-2 mt-2" onSubmit={async e=>{ e.preventDefault(); if(!name) return; await onCreate(name); setName('') }}>
      <input className="border rounded px-3 py-2 w-64" placeholder="New Permission Name (e.g., user:create)" value={name} onChange={e=>setName(e.target.value)} />
      <button className="px-3 py-2 bg-black text-white rounded">Create Perm</button>
    </form>
  )
}
