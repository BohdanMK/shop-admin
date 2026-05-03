import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'


export const getDashboardStatsApi = async () => {
    const { data } = await api.get(API_ENDPOINTS.dashboard.stats)
    return data
}