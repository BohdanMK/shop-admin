import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from "react-router-dom"
import {
    Box,
    CircularProgress,
    Typography,
    Stack,
    Button
} from '@mui/material'
import { useProductsStore } from '@/store/productsStore'
import { useCategoriesStore } from '@/store/categoriesStore'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import { getProductsBreadcrumbs } from '@/router/breadcrumbs'
import ProductsTable from '@/components/products/ProductsTable'
import ResultCount from '@/components/ui/ResultCount'
import ProductsFilter from '@/components/product/ProductsFilter'
import ActiveFiltersList from '@/components/ui/ActiveFiltersList'
import { useSnackbar } from '@/context/SnackbarContext'
import { buildProductsActiveFilters } from '@/helpers/activeFilters/buildProductsActiveFilters'



const Products = () => {
    const { t } = useTranslation(['common', 'messages'])
    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()
    const products = useProductsStore((state) => state.products)
    const isLoading = useProductsStore((state) => state.isLoading)
    const error = useProductsStore((state) => state.error)
    const fetchProducts = useProductsStore((state) => state.fetchProducts)
    const productsPagination = useProductsStore((state) => state.productsPagination)
    const fetchCategories = useCategoriesStore((state) => state.fetchCategories)
    const categories = useCategoriesStore((state) => state.categories)
    const productsOptions = useProductsStore((state) => state.productsOptions)
    const deleteProduct = useProductsStore((state) => state.deleteProduct)
    const removeFilter = useProductsStore((state) => state.removeFilter)
    const activeFilters = buildProductsActiveFilters(productsOptions, categories)

    const goToCreate = () => {
        navigate("/products/new")
    }

    const handleDeleteProduct = async (productId: string) => {
        if (!productId) return;
        try {
            await deleteProduct(productId);
            showSnackbar({ message: t('messages:productDeleted'), severity: 'success' });
            await fetchProducts()
        } catch (error) {
            console.error("Failed to delete product:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
            showSnackbar({ message: errorMessage, severity: 'error' });
        }
    };

    useEffect(() => {
        void fetchProducts()
    }, [fetchProducts, productsOptions])

    useEffect(() => {
        void fetchCategories()
    }, [fetchCategories])

    return (
        <Box>
            <BreadcrumbsList list={getProductsBreadcrumbs(t)} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:products')}
                </Typography>
                {/* <ResultCount
                    count={productsPagination.total}
                /> */}
                <Button
                    variant="outlined"
                    onClick={goToCreate}
                    data-testid="product-create-btn"
                >
                    {t('common:createProduct')}
                </Button>
            </Box>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <ResultCount
                    count={productsPagination.total}
                />
                <ProductsFilter
                    categories={categories}
                />
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
            {!isLoading && !error && (
                <ProductsTable
                    productsList={products}
                        onDeleteSuccess={(productId) => {
                            void handleDeleteProduct(productId)
                        }}
                    />
            )}

        </Box>

    )
}

export default Products