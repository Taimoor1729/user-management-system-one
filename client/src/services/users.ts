import api from './api'

export const listUsers = async () => (await api.get('/users')).data
export const createUser = async (payload:{ name:string; email:string; password:string }) => (await api.post('/users', payload)).data
export const assignRole = async (userId:string, roleId:string) => (await api.patch(`/users/${userId}/assign-role`, { roleId })).data
export const setOverrides = async (userId:string, add:string[] = [], remove:string[] = []) => (await api.patch(`/users/${userId}/overrides`, { add, remove })).data
