import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { ProductOptionGroupDTO, ProductOptionGroupPayloadDTO } from '@/dto/types/products.dto'

export const getProductOptionsApi = async (): Promise<ProductOptionGroupDTO[]> => {
    const { data } = await api.get<ProductOptionGroupDTO[]>(API_ENDPOINTS.productsOptions.list)
    return data
}

export const createProductOptionGroupApi = async (groupData: ProductOptionGroupPayloadDTO): Promise<ProductOptionGroupDTO> => {
    const { data } = await api.post<ProductOptionGroupDTO>(API_ENDPOINTS.productsOptions.create, groupData)
    return data
}

export const updateProductOptionGroupApi = async (groupId: string, groupData: ProductOptionGroupPayloadDTO): Promise<ProductOptionGroupDTO> => {
    const { data } = await api.patch<ProductOptionGroupDTO>(API_ENDPOINTS.productsOptions.update(groupId), groupData)
    return data
}

export const deleteProductOptionGroupApi = async (groupId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.productsOptions.delete(groupId))
}