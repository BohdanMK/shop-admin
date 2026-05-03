import {create} from 'zustand'
import type { ICategoryInfoDTO, ISubCategoriesDTO } from '@/dto/types/subCategories.dto'
import { getCategoriesApi, getCategoryByIdApi, createCategoryApi, deleteCategoryApi, getSubCategoriesApi, updateCategoryApi, createSubCategoryApi, updateSubCategoryApi, deleteSubCategoryApi } from '@/api/category'
import type { PaginationState } from '@/types/pagination'



interface CategoriesOptions {
    limit: number;
    page: number;
    search?: string;
    sortBy?: 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';

}

export type CategoriesFilters = Pick<CategoriesOptions, 'search'>

interface CategoriesState {
    categories: ICategoryInfoDTO[],
    categoriesOptions: CategoriesOptions,
    categoryInfo: ICategoryInfoDTO | null,
    categoryPagination: PaginationState,
    subCategories: ISubCategoriesDTO[],
    subCategoryInfo: ISubCategoriesDTO | null,
    isLoading: boolean,
    isLoadingSubCategories: boolean,
    isLoadingSubCategoryInfoCreate: boolean,
    isLoadingSubCategoryInfoUpdate: boolean,
    isLoadingSubCategoryInfoDelete: boolean,
    isLoadingCreate: boolean,
    isLoadingDelete: boolean,
    isLoadingUpdate: boolean,
    error: string | null
    fetchCategories: () => Promise<void>
    updateOptions: (options: CategoriesOptions) => void
    setFilters: (filters: Partial<CategoriesOptions>) => void
    removeFilter: (key: keyof CategoriesFilters) => void
    setSorting: (params: { sortBy?: 'createdAt' | 'title'; sortOrder?: 'asc' | 'desc' }) => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    fetchCategoryById: (id: string) => Promise<ICategoryInfoDTO | null>
    fetchSubCategories: (categoryId: string) => Promise<void>
    createCategory: (data: { title: string, imageId: string | null, image: string | null }) => Promise<void>
    deleteCategory: (id: string) => Promise<void>
    updateCategory: (id: string, data: { title: string, imageId: string | null, image: string | null }) => Promise<void>
    createSubCategory: (categoryId: string, data: { title: string }) => Promise<void>
    updateSubCategory: (categoryId: string, subCategoryId: string, data: { title: string }) => Promise<void>
    deleteSubCategory: (categoryId: string, subCategoryId: string) => Promise<void>
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
    categories: [],
    categoryPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
    categoriesOptions: {
        page: 1,
        limit: 10,
        sortBy: undefined,
        sortOrder: undefined,
        search: undefined,
    },
    categoryInfo: null,
    subCategories: [],
    subCategoryInfo: null,
    isLoading: false,
    isLoadingSubCategories: false,
    isLoadingSubCategoryInfoCreate: false,
    isLoadingSubCategoryInfoUpdate: false,
    isLoadingSubCategoryInfoDelete: false,
    isLoadingCreate: false,
    isLoadingDelete: false,
    isLoadingUpdate: false,
    error: null,
    fetchCategories: async () => {
        const options = get().categoriesOptions
        set({ isLoading: true, error: null })
        try {
            const categoriesData = await getCategoriesApi(options)
            set({ categories: categoriesData.items,
                categoryPagination: {
                    total: categoriesData.total,
                    page: categoriesData.page,
                    limit: categoriesData.limit,
                    totalPages: categoriesData.totalPages,
                }})
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories'
            set({ error: errorMessage })
            console.error('Failed to fetch categories:', error)
        }
        finally {
            set({ isLoading: false })
        }
    },
    updateOptions: (options: CategoriesOptions) => {
        set((state) => ({
            categoriesOptions: { ...state.categoriesOptions, ...options }
        }));
        void get().fetchCategories();
    },
    setFilters: (filters: Partial<CategoriesOptions>) => {
        set((state) => ({
            categoriesOptions: { ...state.categoriesOptions, ...filters }
        }));
        void get().fetchCategories();
    },
    removeFilter: (key: keyof CategoriesFilters) => {
        set((state) => ({
            categoriesOptions: { ...state.categoriesOptions, [key]: undefined }
        }));
        void get().fetchCategories();
    },
    setSorting: (params: { sortBy?: 'createdAt' | 'title'; sortOrder?: 'asc' | 'desc' }) => {
        set((state) => ({
            categoriesOptions: { ...state.categoriesOptions, ...params }
        }));
        void get().fetchCategories();
    },
    setPage: (page: number) => {
        set((state) => ({
            categoriesOptions: { ...state.categoriesOptions, page },
        }));
        void get().fetchCategories();
    },
    setLimit: (limit: number) => {
        set((state) => ({
            categoriesOptions: { ...state.categoriesOptions, limit, page: 1 },
        }));
        void get().fetchCategories();
    },
    fetchCategoryById: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
            const categoryData = await getCategoryByIdApi(id)
            set({ categoryInfo: categoryData })
            return categoryData
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch category info'
            set({ error: errorMessage })
            console.error('Failed to fetch category info:', error)
            return null
        }
        finally {
            set({ isLoading: false })
        }
    },
    fetchSubCategories: async (categoryId: string) => {
        set({ isLoadingSubCategories: true, error: null })
        try {
            const subCategoriesData = await getSubCategoriesApi(categoryId)
            set({ subCategories: subCategoriesData || [] })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch subcategories'
            set({ error: errorMessage })
            console.error('Failed to fetch subcategories:', error)
        }
        finally {
            set({ isLoadingSubCategories: false })
        }
    },
    createCategory: async (data: { title: string, imageId: string | null, image: string | null }) => {
        set({ isLoadingCreate: true, error: null })
        try {
            // Implement the API call to create a category here
            // For example:
            await createCategoryApi(data)
            console.log('Creating category with data:', data)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create category'
            set({ error: errorMessage })
            console.error('Failed to create category:', error)
        }
        finally {
            set({ isLoadingCreate: false })
        }
    },
    deleteCategory: async (id: string) => {
        set({ isLoadingDelete: true, error: null })
        try {
            await deleteCategoryApi(id)
            console.log('Deleting category with ID:', id)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete category'
            set({ error: errorMessage })
            console.error('Failed to delete category:', error)
            throw error
        }
        finally {
            set({ isLoadingDelete: false })
        }
    },
    updateCategory: async (id: string, data: { title: string, imageId: string | null, image: string | null }) => {
        set({ isLoadingUpdate: true, error: null })
        try {
            await updateCategoryApi(id, data)
            console.log('Updating category with ID:', id, 'and data:', data)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update category'
            set({ error: errorMessage })
            console.error('Failed to update category:', error)
        }
        finally {
            set({ isLoadingUpdate: false })
        }
    },
    createSubCategory: async (categoryId: string, data: { title: string }) => {
        set({ isLoadingSubCategoryInfoCreate: true, error: null })
        try {
            await createSubCategoryApi(categoryId, data)
            console.log('Creating subcategory for category ID:', categoryId, 'with data:', data)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create subcategory'
            set({ error: errorMessage })
            console.error('Failed to create subcategory:', error)
        }
        finally {
            set({ isLoadingSubCategoryInfoCreate: false })
        }
    },
    updateSubCategory: async (categoryId: string, subCategoryId: string, data: { title: string }) => {
        set({ isLoadingSubCategoryInfoUpdate: true, error: null })
        try {
            await updateSubCategoryApi(categoryId, subCategoryId, data)
            console.log('Updating subcategory with ID:', subCategoryId, 'for category ID:', categoryId, 'with data:', data)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update subcategory'
            set({ error: errorMessage })
            console.error('Failed to update subcategory:', error)
        }
        finally {
            set({ isLoadingSubCategoryInfoUpdate: false })
        }
    },
    deleteSubCategory: async (categoryId: string, subCategoryId: string) => {
        set({ isLoadingSubCategoryInfoDelete: true, error: null })
        try {
            await deleteSubCategoryApi(categoryId, subCategoryId)
            console.log('Deleting subcategory with ID:', subCategoryId, 'for category ID:', categoryId)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete subcategory'
            set({ error: errorMessage })
            console.error('Failed to delete subcategory:', error)
        }
        finally {
            set({ isLoadingSubCategoryInfoDelete: false })
        }
    }

}))