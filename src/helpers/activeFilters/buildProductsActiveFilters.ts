import type { ICategoryInfoDTO } from '@/dto/types/subCategories.dto'
import type { ActiveFilter } from '@/components/ui/ActiveFiltersList'
import type { ProductsFilters } from '@/store/productsStore'

export const buildProductsActiveFilters = (
    filters: ProductsFilters,
    categories: ICategoryInfoDTO[],
): ActiveFilter<keyof ProductsFilters>[] => {
    const activeFilters: ActiveFilter<keyof ProductsFilters>[] = []

    if (filters.search?.trim()) {
        activeFilters.push({
            id: 'search',
            label: `Пошук: ${filters.search.trim()}`,
        })
    }

    if (filters.categoryId) {
        const categoryTitle = categories.find((category) => category._id === filters.categoryId)?.title

        activeFilters.push({
            id: 'categoryId',
            label: `Категорія: ${categoryTitle ?? filters.categoryId}`,
        })
    }

    if (filters.priceMin !== undefined) {
        activeFilters.push({
            id: 'priceMin',
            label: `Ціна від: ${filters.priceMin}`,
        })
    }

    if (filters.priceMax !== undefined) {
        activeFilters.push({
            id: 'priceMax',
            label: `Ціна до: ${filters.priceMax}`,
        })
    }

    if (filters.isOnSale !== undefined) {
        activeFilters.push({
            id: 'isOnSale',
            label: filters.isOnSale ? 'Зі знижкою' : 'Без знижки',
        })
    }

    return activeFilters
}