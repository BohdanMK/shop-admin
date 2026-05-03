import {create} from 'zustand'
import { getDashboardStatsApi } from '@/api/dashboard'

interface chartOrdersPerDayData {
    days: number[]
    orders: number[]
    revenue: number[]
}

interface OrderPerDay {
    day: number
    count: number
    revenue: number
}

interface DashboardTotals {
    monthOrders: number
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    totalCategories: number
}

interface DashboardState {
    totals: DashboardTotals | null
    ordersPerDay: OrderPerDay[]
    chartOrdersPerDayData: chartOrdersPerDayData
    isLoading: boolean
    error: string | null
    fetchStats: () => Promise<void>
}


export const useDashboardStore = create<DashboardState>((set) => ({
    totals: null,
    ordersPerDay: [],
    chartOrdersPerDayData: {
        days: [],
        orders: [],
        revenue: [],
    },
    isLoading: false,
    error: null,
    fetchStats: async () => {
        set({ isLoading: true, error: null })

        try {
        const data = await getDashboardStatsApi()

        const days = data.ordersPerDay.map((i: OrderPerDay) => i.day)
        const orders = data.ordersPerDay.map((i: OrderPerDay) => i.count)
        const revenue = data.ordersPerDay.map((i: OrderPerDay) => i.revenue)

        set({
            totals: {
                monthOrders: data.monthOrders,
                totalOrders: data.totalOrders,
                totalRevenue: data.totalRevenue,
                totalProducts: data.totalProducts,
                totalCategories: data.totalCategories,
            },
            ordersPerDay: data.ordersPerDay,
            chartOrdersPerDayData: { days, orders, revenue },
        })
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch dashboard stats' })
        } finally {
            set({ isLoading: false })
        }
    },
}))