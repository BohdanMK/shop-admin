import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Alert,
    Box,
    CircularProgress,
    Typography,
    Stack
} from '@mui/material'
import { useCategoriesStore } from '@/store/categoriesStore'
import { getCategoriesBreadcrumbs } from '@/router/breadcrumbs'
import CategoriesTable from '@/components/categories/CategoriesTable'
import CreateCategory from '@/components/categories/popup/CategoryItem'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import ResultCount from '@/components/ui/ResultCount'
import CategoriesFilter from '@/components/categories/CategoriesFilter'
import ActiveFiltersList from '@/components/ui/ActiveFiltersList'
import { buildCategoriesActiveFilters } from '@/helpers/activeFilters/buildCategoriesActiveFilters'

const Categories = () => {
    const { t } = useTranslation(['common'])
    const categories = useCategoriesStore((state) => state.categories)
    const isLoading = useCategoriesStore((state) => state.isLoading)
    const error = useCategoriesStore((state) => state.error)
    const fetchCategories = useCategoriesStore((state) => state.fetchCategories)
    const categoriesTotal = useCategoriesStore((state) => state.categoryPagination.total)
    const categoriesOptions = useCategoriesStore((state) => state.categoriesOptions)
    const removeFilter = useCategoriesStore((state) => state.removeFilter)
    const activeFilters = buildCategoriesActiveFilters(categoriesOptions)


    useEffect(() => {
        void fetchCategories()
    }, [fetchCategories])

    return (
        <Box>
            <BreadcrumbsList list={getCategoriesBreadcrumbs(t)} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:categories')}
                </Typography>

                <CreateCategory
                    onCreateSuccess={() => {
                        void fetchCategories()
                    }}
                />
            </Box>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <ResultCount count={categoriesTotal}  />
                <CategoriesFilter />
            </Stack>
            <ActiveFiltersList
                filters={activeFilters}
                onRemove={removeFilter}
            />
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!isLoading && !error && (
                <CategoriesTable
                    categoriesList={categories}
                    onCreateSuccess={() => {
                        void fetchCategories()
                    }}
                />
            )}
        </Box>
    )
}

export default Categories
