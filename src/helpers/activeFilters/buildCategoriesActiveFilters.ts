import type { ActiveFilter } from '@/components/ui/ActiveFiltersList'
import type { CategoriesFilters } from '@/store/categoriesStore'

export const buildCategoriesActiveFilters = (
    filters: CategoriesFilters,
): ActiveFilter<keyof CategoriesFilters>[] => {
    const activeFilters: ActiveFilter<keyof CategoriesFilters>[] = []

    if (filters.search?.trim()) {
        activeFilters.push({
            id: 'search',
            label: `Пошук: ${filters.search.trim()}`,
        })
    }

    return activeFilters
}