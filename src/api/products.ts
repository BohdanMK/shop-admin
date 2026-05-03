import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { ProductDTO } from '@/dto/types/products.dto'
import type { PaginatedResponse } from '@/dto/types/responses.dto'

export const getProductsApi = async (params?: { page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }): Promise<PaginatedResponse<ProductDTO>> => {
    const { data } = await api.get(API_ENDPOINTS.products.list, { params })
    return data
}

export const getProductByIdApi = async (productId: string):Promise<ProductDTO> => {
    const { data } = await api.get(API_ENDPOINTS.products.productById(productId))
    return data
}

export const createProductApi = async (productData: ProductDTO): Promise<ProductDTO> => {
    const { data } = await api.post(API_ENDPOINTS.products.create, productData)
    return data
}

export const updateProductApi = async (productId: string, productData: Partial<ProductDTO>): Promise<ProductDTO> => {
    const { data } = await api.patch(API_ENDPOINTS.products.update(productId), productData)
    return data
}

export const deleteProductApi = async (productId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.products.delete(productId))
}

export const createProductOptionGroupForProductApi = async (productId: string, optionGroupData: { name: string }): Promise<void> => {
    await api.post(API_ENDPOINTS.products.createProductOptionGroup(productId), optionGroupData)
}

export const updateProductOptionGroupForProductApi = async (productId: string, optionId: string, optionGroupData: { name: string }): Promise<void> => {
    await api.patch(API_ENDPOINTS.products.updateProductOptionGroupApi(productId, optionId), optionGroupData)
}

export const deleteProductOptionGroupForProductApi = async (productId: string, optionId: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.products.deleteProductOptionGroupApi(productId, optionId))
}