import { create } from "zustand";
import type { ProductDTO } from "@/dto/types/products.dto";

import { createProductApi, deleteProductApi, getProductsApi, getProductByIdApi, updateProductApi } from "@/api/products";
import { extractErrorMessage } from "../helpers/extractErrorMessage";
import type { PaginationState } from '@/types/pagination';

type SortOrder = 'asc' | 'desc'
type ProductSortField = 'price'

export interface ProductsOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: ProductSortField;
    sortOrder?: SortOrder;
    categoryId?: string;
    priceMin?: number;
    priceMax?: number;
    isOnSale?: boolean;
}

export type ProductsFilters = Pick<ProductsOptions, 'search' | 'categoryId' | 'priceMin' | 'priceMax' | 'isOnSale'>

interface ProductsState {
    products: ProductDTO[],
    productsPagination: PaginationState,
    productsOptions: ProductsOptions,
    productInfo: ProductDTO | null,
    isLoading: boolean,
    isLoadingCreate: boolean,
    isLoadingUpdate: boolean,
    isLoadingDelete: boolean,
    error: string | null,
    fetchProducts: (options?: ProductsOptions) => Promise<void>
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    setSorting: (params: { sortBy?: ProductSortField; sortOrder?: SortOrder }) => void
    setFilters: (filters: Partial<ProductsFilters>) => void
    removeFilter: (key: keyof ProductsFilters) => void
    fetchProductById: (id: string) => Promise<void>
    createProduct: (data: Omit<ProductDTO, '_id' | 'id'>) => Promise<void>
    updateProduct: (id: string, data: Partial<ProductDTO>) => Promise<void>
    deleteProduct: (id: string) => Promise<void>
}

export const useProductsStore = create<ProductsState>((set, get) => ({
    products: [],
    productInfo: null,
    productsPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
    productsOptions: {
        page: 1,
        limit: 10,
        search: '',
        sortBy: undefined,
        sortOrder: undefined,
    },
    isLoading: false,
    isLoadingCreate: false,
    isLoadingUpdate: false,
    isLoadingDelete: false,
    error: null,
    fetchProducts: async (options?: ProductsOptions) => {
        const currentOptions = get().productsOptions;
        const mergedOptions = { ...currentOptions, ...options };
        set({ isLoading: true, error: null })
        try {
            const productsData = await getProductsApi(mergedOptions)
            set({
                products: productsData.items,
                productsPagination: {
                    total: productsData.total,
                    page: productsData.page,
                    limit: productsData.limit,
                    totalPages: productsData.totalPages,
                },
            })
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Failed to fetch products')
            set({ error: errorMessage })
            console.error('Failed to fetch products:', error)
        }
        finally {
            set({ isLoading: false })
        }
    },
    setPage: (page: number) => {
        set((state) => ({
            productsOptions: { ...state.productsOptions, page },
        }));
        void get().fetchProducts();
    },
    setLimit: (limit: number) => {
        set((state) => ({
            productsOptions: { ...state.productsOptions, limit, page: 1 },
        }));
        void get().fetchProducts();
    },
    setSorting: ({ sortBy, sortOrder }) => {
        set((state) => ({
            productsOptions: { ...state.productsOptions, sortBy, sortOrder, page: 1 },
        }));
        void get().fetchProducts();

    },
    setFilters: (filters) => {
        set((state) => ({
            productsOptions: {
                ...state.productsOptions,
                search: filters.search,
                categoryId: filters.categoryId,
                priceMin: filters.priceMin,
                priceMax: filters.priceMax,
                isOnSale: filters.isOnSale,
                page: 1,
            }
        }));
    },
    removeFilter: (key: keyof ProductsFilters) => {
        set((state) => ({
            productsOptions: {
                ...state.productsOptions,
                [key]: undefined,
                page: 1,
            }
        }));
    },
    fetchProductById: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
            const product = await getProductByIdApi(id)
            set({ productInfo: product })
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Failed to fetch product details')
            set({ error: errorMessage })
            console.error('Failed to fetch product details:', error)
        }
        finally {
            set({ isLoading: false })
        }
    },
    createProduct: async (data: Omit<ProductDTO, '_id' | 'id'>) => {
        set({ isLoadingCreate: true, error: null })
        try {
            const createdProduct = await createProductApi(data as ProductDTO)
            set((state) => ({
                products: [createdProduct, ...state.products],
                productInfo: createdProduct,
            }))
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Failed to create product')

            set({ error: errorMessage })

            throw new Error(errorMessage)
        }
        finally {
            set({ isLoadingCreate: false })
        }
    },
    updateProduct: async (id: string, data: Partial<ProductDTO>) => {
        set({ isLoadingUpdate: true, error: null })
        try {
            const updatedProduct = await updateProductApi(id, data)
            set((state) => ({
                productInfo: updatedProduct,
                products: state.products.map((product) => {
                    const productKey = product.id ?? product._id
                    return productKey === id ? { ...product, ...updatedProduct } : product
                }),
            }))
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Failed to update product')
            set({ error: errorMessage })
            throw new Error(errorMessage)
        }
        finally {
            set({ isLoadingUpdate: false })
        }
    },
    deleteProduct: async (id: string) => {
        set({ isLoadingDelete: true, error: null })
        try {
            await deleteProductApi(id)
        } catch (error) {
            const errorMessage = extractErrorMessage(error, 'Failed to delete product')
            set({ error: errorMessage })
            console.error('Failed to delete product:', error)
        }
        finally {
            set({ isLoadingDelete: false })
        }
    },
}))