import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { PaginatedResponse } from '@/dto/types/responses.dto'
import type { Location } from '@/dto/types/locations.dto'

export const getLocationsApi = async (): Promise<PaginatedResponse<Location>> => {
    const { data } = await api.get(API_ENDPOINTS.locations.list)
    return data
}

export const createLocationApi = async (data: { name: string, locationType: string, lat: number, lng: number }) => {
    const response = await api.post(API_ENDPOINTS.locations.create, data)
    return response.data
}

export const updateLocationApi = async (id: string, data: { name: string, locationType: string, lat: number, lng: number }) => {
    const response = await api.patch(API_ENDPOINTS.locations.update(id), data)
    return response.data
}

export const deleteLocationApi = async (id: string) => {
    await api.delete(API_ENDPOINTS.locations.delete(id))
}

export const getLocationByIdApi = async (id: string) => {
    const { data } = await api.get(API_ENDPOINTS.locations.locationById(id))
    return data
}