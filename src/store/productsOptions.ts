import {create} from 'zustand'
import type { ProductOptionGroupDTO, ProductOptionGroupPayloadDTO } from '@/dto/types/products.dto'
import { getProductOptionsApi, createProductOptionGroupApi, updateProductOptionGroupApi, deleteProductOptionGroupApi } from '@/api/productsOptions'


interface ProductsOptionsState {
    optionsGroups: ProductOptionGroupDTO[],
    isLoading: boolean,
    isLoadingCreate: boolean,
    isLoadingUpdate: boolean,
    isLoadingDelete: boolean,
    error: string | null,
    fetchProductOptions: () => Promise<void>,
    createProductOptionGroup: (groupData: ProductOptionGroupPayloadDTO) => Promise<void>,
    updateProductOptionGroup: (groupId: string, groupData: ProductOptionGroupPayloadDTO) => Promise<void>,
    deleteProductOptionGroup: (groupId: string) => Promise<void>,
}

export const useProductsOptionsStore = create<ProductsOptionsState>((set) => ({
    optionsGroups: [],
    isLoading: false,
    isLoadingCreate: false,
    isLoadingUpdate: false,
    isLoadingDelete: false,
    error: null,
    fetchProductOptions: async () => {
        set({ isLoading: true, error: null })
        try {
            const optionsData = await getProductOptionsApi()
            set({ optionsGroups: optionsData })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product options'
            set({ error: errorMessage })
            console.error('Failed to fetch product options:', error)
        }
        finally {
            set({ isLoading: false })
        }
    },
    createProductOptionGroup: async (groupData) => {
        set({ isLoadingCreate: true, error: null })
        try {
            await createProductOptionGroupApi(groupData)

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create product option group'
            set({ error: errorMessage })
            console.error('Failed to create product option group:', error)
            throw new Error(errorMessage)
        }
        finally {
            set({ isLoadingCreate: false })
        }
    },
    updateProductOptionGroup: async (groupId, groupData) => {
        set({ isLoadingUpdate: true, error: null })
        try {
            await updateProductOptionGroupApi(groupId, groupData)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update product option group'
            set({ error: errorMessage })
            console.error('Failed to update product option group:', error)
            throw new Error(errorMessage)
        }
        finally {
            set({ isLoadingUpdate: false })
        }
    },
    deleteProductOptionGroup: async (groupId) => {
        set({ isLoadingDelete: true, error: null })
        try {
            await deleteProductOptionGroupApi(groupId)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete product option group'
            set({ error: errorMessage })
            console.error('Failed to delete product option group:', error)
            throw new Error(errorMessage)
        }
        finally {
            set({ isLoadingDelete: false })
        }

    }



}))