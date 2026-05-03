import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'

export const uploadFileApi = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post(API_ENDPOINTS.uploads.upload, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return data
}