import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { Role } from '@/types/role'

interface LoginPayload {
    email: string
    password: string
}

interface LoginResponse {
    token: string
    role: Role
}

export const loginApi = async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(API_ENDPOINTS.auth.login, payload)
    return data
}