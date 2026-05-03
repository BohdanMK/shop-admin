import type { OrdersFilters } from '@/store/ordersStore'
import type { ActiveFilter } from '@/components/ui/ActiveFiltersList'

export const buildOrdersActiveFilters = (
    filters: OrdersFilters,
): ActiveFilter<keyof OrdersFilters>[] => {
    const activeFilters: ActiveFilter<keyof OrdersFilters>[] = []

    if (filters.name?.trim()) {
        activeFilters.push({
            id: 'name',
            label: `Ім'я: ${filters.name.trim()}`,
        })
    }

    if (filters.phone?.trim()) {
        activeFilters.push({
            id: 'phone',
            label: `Телефон: ${filters.phone.trim()}`,
        })
    }

    if (filters.cityName?.trim()) {
        activeFilters.push({
            id: 'cityName',
            label: `Місто: ${filters.cityName.trim()}`,
        })
    }

    if (filters.status?.trim()) {
        activeFilters.push({
            id: 'status',
            label: `Статус: ${filters.status.trim()}`,
        })
    }

    return activeFilters
}
