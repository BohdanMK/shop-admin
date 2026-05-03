import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'

export const getOrdersApi = async (options: any) => {
    const { data } = await api.get(API_ENDPOINTS.orders.list, { params: options })
    return data
}

export const updateOrderStatusApi = async (orderId: string, status: string) => {
    const { data } = await api.patch(API_ENDPOINTS.orders.updateStatus(orderId), { status })
    return data
}