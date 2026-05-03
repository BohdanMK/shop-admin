import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { CompanyInfoDTO } from '@/dto/types/companyInfo'

export const getCompanyInfoApi = async (): Promise<CompanyInfoDTO> => {
    const { data } = await api.get(API_ENDPOINTS.companyInfo.get)
    return data
}

export const updateCompanyInfoApi = async (data: CompanyInfoDTO): Promise<CompanyInfoDTO> => {
    const response = await api.patch(API_ENDPOINTS.companyInfo.update, data)
    return response.data
}