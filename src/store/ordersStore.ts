import {create} from 'zustand'
import { getOrdersApi, updateOrderStatusApi } from '@/api/orders'
import type { IOrderInfoDTO } from '@/dto/types/orders.dto'
import type { PaginationState } from '@/types/pagination'

interface OrdersOptions {
    page?: number;
    limit?: number;
    name?: string;
    phone?: string;
    cityName?: string;
    sortBy?: 'createdAt' | 'total';
    sortOrder?: 'asc' | 'desc';
    status?: 'pending' | 'confirmed' | 'processing';
}

export type OrdersFilters = Pick<OrdersOptions, 'name' | 'status' | 'phone' | 'cityName'>


interface OrdersState {
    orders: IOrderInfoDTO[],
    isLoading: boolean,
    error: string | null,
    ordersPagination: PaginationState,
    ordersOptions: OrdersOptions,
    fetchOrders: (options?: OrdersOptions ) => Promise<void>
    updateOptions: (options: OrdersOptions) => void
    setSorting: (params: { sortBy?: 'createdAt' | 'total'; sortOrder?: 'asc' | 'desc' }) => void
    setFilters: (filters: Partial<OrdersOptions>) => void
    removeFilter: (key: keyof Pick<OrdersOptions, 'name' | 'cityName' | 'status' | 'phone'>) => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    updateOrderStatus: (orderId: string, status: string) => Promise<void>
}


export const useOrdersStore = create<OrdersState>((set ,get) => ({
    orders: [],

    isLoading: false,
    error: null,
    ordersPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
    ordersOptions: {
        page: 1,
        limit: 10,
        sortBy: undefined,
        sortOrder: undefined,
        search: undefined,
        status: undefined,
    },
    fetchOrders: async () => {
        const options = get().ordersOptions
        set({ isLoading: true, error: null })
        try {
            console.log('fetching with options:', options)
            const ordersData = await getOrdersApi(options)
            set({ orders: ordersData.items,
                ordersPagination: {
                    total: ordersData.total ,
                    page: ordersData.page ?? 1,
                    limit: ordersData.limit ?? 10,
                    totalPages: ordersData.totalPages,
                }
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch orders'
            set({ error: errorMessage })
            console.error('Failed to fetch orders:', error)
        }
        finally {
            set({ isLoading: false })
        }
    },
    updateOptions: (options: OrdersOptions) => {
        set((state) => ({
            ordersOptions: { ...state.ordersOptions, ...options }
        }));
        void get().fetchOrders();
    },
    setSorting: ({sortBy, sortOrder}) => {
        get().updateOptions({ sortBy, sortOrder, page: 1 });
    },
    setFilters: (filters: Partial<OrdersOptions>) => {
        set((state) => ({
            ordersOptions: { ...state.ordersOptions, ...filters, page: 1 }
        }));
        void get().fetchOrders();
    },
    removeFilter: (key: keyof Pick<OrdersOptions, 'name' | 'status' | 'phone' | 'cityName'>) => {
        set((state) => ({
            ordersOptions: { ...state.ordersOptions, [key]: undefined, page: 1 }
        }));
        void get().fetchOrders();
    },
    setPage: (page: number) => {
        set((state) => ({
            ordersOptions: { ...state.ordersOptions, page }
        }));
        void get().fetchOrders();
    },
    setLimit: (limit: number) => {
        set((state) => ({
            ordersOptions: { ...state.ordersOptions, limit, page: 1 }
        }));
        void get().fetchOrders();
    },
    updateOrderStatus: async (orderId: string, status: string) => {
        try {
            await updateOrderStatusApi(orderId, status)
        } catch (error) {
            console.error('Failed to update order status:', error)
            throw error
        }
    }
}))
