import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { ICategoryInfoDTO } from '@/dto/types/subCategories.dto'
import type { PaginatedResponse } from '@/dto/types/responses.dto'

export const getCategoriesApi = async (options: any):Promise<PaginatedResponse<ICategoryInfoDTO>> => {
    const { data } = await api.get(API_ENDPOINTS.categories.list, { params: options })
    return data
}

export const getCategoryByIdApi = async (id: string) => {
    const { data } = await api.get(API_ENDPOINTS.categories.categoryById(id))
    return data
}

export const getSubCategoriesApi = async (categoryId: string) => {
    const { data } = await api.get(API_ENDPOINTS.categories.subCategories(categoryId))
    return data
}

export const createCategoryApi = async (data: { title: string, imageId: string | null, image: string | null }) => {
    const response = await api.post(API_ENDPOINTS.categories.create, data)
    return response.data
}

export const updateCategoryApi = async (id: string, data: { title: string, imageId: string | null, image: string | null }) => {
    const response = await api.patch(API_ENDPOINTS.categories.updateCategory(id), data)
    return response.data
}

export const deleteCategoryApi = async (id: string) => {
    await api.delete(API_ENDPOINTS.categories.delete(id))
}

export const createSubCategoryApi = async (categoryId: string, data: { title: string }) => {
    const response = await api.post(API_ENDPOINTS.categories.createSubCategory(categoryId), data)
    return response.data
}

export const updateSubCategoryApi = async (categoryId: string, subCategoryId: string, data: { title: string }) => {
    const response = await api.patch(API_ENDPOINTS.categories.updateSubCategory(categoryId, subCategoryId), data)
    return response.data
}

export const deleteSubCategoryApi = async (categoryId: string, subCategoryId: string) => {
    await api.delete(API_ENDPOINTS.categories.deleteSubCategory(categoryId, subCategoryId))
}