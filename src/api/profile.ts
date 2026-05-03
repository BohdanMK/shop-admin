import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'

export const getProfileApi = async () => {
    const { data } = await api.get(API_ENDPOINTS.profile.me)
    return data
}