import api from './api'

export const listPermissions = async () => (await api.get('/permissions')).data
export const createPermission = async (payload:{ name:string, description?:string }) => (await api.post('/permissions', payload)).data
