import api from './api'

export const listRoles = async () => (await api.get('/roles')).data
export const createRole = async (payload:{ name:string }) => (await api.post('/roles', payload)).data
export const editRolePerms = async (roleId:string, add:string[] = [], remove:string[] = []) => (await api.patch(`/roles/${roleId}/permissions`, { add, remove })).data
