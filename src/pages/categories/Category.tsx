import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useCategoriesStore } from '@/store/categoriesStore'
import { Box } from '@mui/material'
import SubCategoriesTable from '@/components/categories/SubCategoriesTable'
import CategoryItemPopUp from '@/components/categories/popup/CategoryItem'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import { getCategoryDetailsBreadcrumbs } from '@/router/breadcrumbs'

const Category = () => {
    const { t } = useTranslation(['common'])
    const { id } = useParams<{ id: string }>()
    const categoryInfo = useCategoriesStore((state) => state.categoryInfo)
    const subCategories = useCategoriesStore((state) => state.subCategories)
    const fetchCategoryById = useCategoriesStore((state) => state.fetchCategoryById)
    const fetchSubCategories = useCategoriesStore((state) => state.fetchSubCategories)
    const isLoadingSubCategories = useCategoriesStore((state) => state.isLoadingSubCategories)

    useEffect(() => {
        if (id) {
            void fetchCategoryById(id)
        }
    }, [id])

    useEffect(() => {
        console.log('Fetched category info:', categoryInfo)
        if(id) {
            void fetchSubCategories(id)
        }
    }, [id])

    return (
        <Box>
            <BreadcrumbsList list={getCategoryDetailsBreadcrumbs(t)} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box component="div">
                    <h2>{t('common:categoryDetails')}</h2>
                    {categoryInfo && (
                        <><h4>  Назва:  {categoryInfo.title}</h4>
                            <span style={{ fontSize: '14px', color: '#666' }}>
                                (ID: {categoryInfo.id})
                            </span>
                        </>
                    )}
                </Box>

                {categoryInfo && (
                    <CategoryItemPopUp
                        categoryData={{
                            title: categoryInfo.title,
                            imageId: categoryInfo.imageId ?? null,
                            image: categoryInfo.image ?? null,
                        }}
                        onCreateSuccess={() => {
                            if (id) {
                                void fetchCategoryById(id)
                            }
                        }}
                        type="edit"
                        categoryId={categoryInfo._id}
                    />
                )}
            </Box>
            {subCategories ? (
                <SubCategoriesTable
                    subCategoriesList={
                        subCategories || []
                    }
                    loading={isLoadingSubCategories}
                    onCreateSuccess={() => {
                        if (id) {
                            void fetchSubCategories(id)
                        }
                    }}
                />
            ) : (
                <p>{t('common:loading')}</p>
            )}
        </Box>
    )
}

export default Category