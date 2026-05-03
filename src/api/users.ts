import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { UserDTO } from '@/dto/types/users.dto.d'
import type { PaginatedResponse } from '@/dto/types/responses.dto'

export const getUsersApi = async (options: any):Promise<PaginatedResponse<UserDTO>> => {
    const { data } = await api.get(API_ENDPOINTS.user.list, { params: options })
    return data
}

export const createUserApi = async (userData: UserDTO): Promise<UserDTO> => {
    const { data } = await api.post(API_ENDPOINTS.user.create, userData)
    return data
}

export const updateUserApi = async (userId: string, userData: UserDTO): Promise<UserDTO> => {
    const { data } = await api.patch(API_ENDPOINTS.user.update(userId), userData)
    return data
}

export const deleteUserApi = async (userId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.user.delete(userId))
}