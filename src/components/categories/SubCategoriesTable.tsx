import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ISubCategoriesDTO } from '../../dto/types/subCategories.dto'
import { useParams } from 'react-router-dom'
import { Box } from '@mui/material'
import { useSnackbar } from '@/context/SnackbarContext'
import { useCategoriesStore } from '@/store/categoriesStore'
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonCopy from '@/components/ui/ButtonCopy';
import SubCategoryItemPopUp from '@/components/categories/popup/SubCategoryItem';
import type { TableAction, TableColumn } from '@/components/ui/table/types'
import TableFactory from '@/components/ui/table/TableFactory'
import ConfirmPopup from '@/components/ui/ConfirmPopup'

interface SubCategoriesTableProps {
    subCategoriesList: ISubCategoriesDTO[],
    loading?: boolean,
    onCreateSuccess?: () => void
}

type SubCategoriesRow = ISubCategoriesDTO & { rowKey: string }

const SubCategoriesTable = ({ subCategoriesList, onCreateSuccess }: SubCategoriesTableProps) => {
    const { t } = useTranslation(['tables', 'messages'])
    const [confirmState, setConfirmState] = useState<{ anchorEl: HTMLElement; onConfirm: () => void } | null>(null)
    const { id } = useParams<{ id: string }>()
    const { showSnackbar } = useSnackbar()
    const deleteSubCategory = useCategoriesStore((state) => state.deleteSubCategory)

    const rows: SubCategoriesRow[] = subCategoriesList.map((subCategory, index) => ({
        ...subCategory,
        rowKey: String(subCategory._id ?? subCategory.id ?? index),
    }))

    const columns: TableColumn<SubCategoriesRow>[] = [
        {
            key: '_id',
            label: t('tables:subcategories.id'),
            render: (_value, subCategory) => (
                <ButtonCopy textToCopy={subCategory._id ?? subCategory.id} />
            ),
            width: '120px',
        },
        {
            key: 'title',
            label: t('tables:subcategories.title'),
            width: '200px',
        },
    ]

    const actions: TableAction<SubCategoriesRow>[] = [
        {
            id: 'edit',
            label: t('common:edit'),
            render: (_subCategory) => (
                <SubCategoryItemPopUp
                    categoryId={id!}
                    type="edit"
                    subCategoryData={_subCategory}
                    onCreateSuccess={() => onCreateSuccess?.()}
                />
            ),
        },
        {
            id: 'delete',
            label: t('common:delete'),
            icon: <DeleteIcon />,
            color: 'error',
            onClick: (subCategory, _index, event) => {
                if (!event) return
                setConfirmState({
                    anchorEl: event.currentTarget,
                    onConfirm: () => void deleteCategory(subCategory._id ?? subCategory.id),
                })
            },
        },
    ]

    const deleteCategory = async (subCategoryId: string) => {
        if (!id) return
        try {
            await deleteSubCategory(id, subCategoryId)
            showSnackbar({ message: t('messages:subcategoryDeleted'), severity: 'success' })
            onCreateSuccess?.()
        } catch (error) {
            console.error('Failed to delete subcategory:', error)
            showSnackbar({ message: (error as Error).message ?? String(error), severity: 'error' })
        }
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <h4>{t('tables:subcategories.heading')}</h4>
                {id && (
                    <SubCategoryItemPopUp
                        categoryId={id}
                        type="create"
                        onCreateSuccess={() => onCreateSuccess?.()}
                    />
                )}
            </Box>
            <TableFactory<SubCategoriesRow>
                data={rows}
                columns={columns}
                actions={actions}
                rowIdKey="rowKey"
                emptyMessage={t('tables:empty.subcategories')}
            />
            <ConfirmPopup
                anchorEl={confirmState?.anchorEl ?? null}
                onClose={() => setConfirmState(null)}
                onConfirm={() => confirmState?.onConfirm()}
            />
        </>
    )
}

export default SubCategoriesTable