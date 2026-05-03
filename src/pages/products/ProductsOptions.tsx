import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Alert,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material'
import { useProductsOptionsStore } from '@/store/productsOptions'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import { getProductOptionsBreadcrumbs } from '@/router/breadcrumbs'
import ProductsOptionsTable from '@/components/products/ProductsOptionsTable'
import ProductsOptionsPopUp from '@/components/products/popup/ProductsOptions.tsx'

const ProductsOptions = () => {
    const { t } = useTranslation(['common'])
    const optionsGroups = useProductsOptionsStore((state) => state.optionsGroups)
    const isLoading = useProductsOptionsStore((state) => state.isLoading)
    const error = useProductsOptionsStore((state) => state.error)
    const fetchProductOptions = useProductsOptionsStore((state) => state.fetchProductOptions)

    useEffect(() => {
        void fetchProductOptions()
    }, [fetchProductOptions])

    return (
        <Box>
            <BreadcrumbsList list={getProductOptionsBreadcrumbs(t)} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:productOptions')}
                </Typography>
                <ProductsOptionsPopUp onCreateSuccess={() => {
                    void fetchProductOptions()
                }} />
            </Box>
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
                <ProductsOptionsTable
                    optionsGroups={optionsGroups}
                    onSuccessUpdate={() => {
                        void fetchProductOptions()
                    }}
                />
            )}
        </Box>
    )
}

export default ProductsOptions