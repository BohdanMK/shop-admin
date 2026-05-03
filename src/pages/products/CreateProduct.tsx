import { useEffect } from "react"
import { useTranslation } from 'react-i18next'
import { useNavigate } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import { useProductsStore } from "@/store/productsStore"
import { useCategoriesStore } from "@/store/categoriesStore"
import BreadcrumbsList from "@/components/ui/BreadcrumbsList"
import { getProductsBreadcrumbs } from "@/router/breadcrumbs"
import ProductForm, { type ProductFormValues } from "@/components/product/ProductForm";
import { useSnackbar } from "@/context/SnackbarContext"



const CreateProduct = () => {
    const { t } = useTranslation(['common', 'messages'])
    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()
    const createProduct = useProductsStore((state) => state.createProduct)
    const fetchCategories = useCategoriesStore((state) => state.fetchCategories)

    const goToPageList = () => {
        navigate("/products")
    }

    const handleCreateProduct = async (data: ProductFormValues) => {
        try {
            await createProduct({
                ...data,
                salePrice: data.salePrice ?? undefined,
                components: [],
                optionGroups: [],
            });
            showSnackbar({ message: t('messages:productCreated'), severity: 'success' });
            goToPageList()
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Failed to create product'

            showSnackbar({
                message: errorMessage,
                severity: 'error'
            })
        }
    };

    useEffect(() => {
        void fetchCategories()
    }, [fetchCategories])

    return (
        <Box>
            <Box>
                <BreadcrumbsList list={getProductsBreadcrumbs(t)} />
            </Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:createProduct')}
                </Typography>
            </Box>
            <ProductForm
                typeActions="create"
                onSubmit={handleCreateProduct}
            />
        </Box>
    )
}

export default CreateProduct