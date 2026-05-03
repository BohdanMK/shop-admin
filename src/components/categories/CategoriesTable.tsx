import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ICategoryInfoDTO } from '../../dto/types/subCategories.dto'
import { useNavigate } from 'react-router-dom'
import { useCategoriesStore } from '@/store/categoriesStore'
import { useSnackbar } from '@/context/SnackbarContext'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import ButtonCopy from '@/components/ui/ButtonCopy';
import { Box } from '@mui/material'
import getImageUrl from '@/helpers/getImageUrl'
import TableFactory from '@/components/ui/table/TableFactory'
import type { TableAction, TableColumn, TableSortState } from '@/components/ui/table/types'
import ConfirmPopup from '@/components/ui/ConfirmPopup'

interface CategoriesTableProps {
    categoriesList: ICategoryInfoDTO[]
    onCreateSuccess?: () => void
}

type CategoryRow = ICategoryInfoDTO & { rowKey: string }

const CategoriesTable = ({ categoriesList, onCreateSuccess }: CategoriesTableProps ) => {
    const { t, i18n } = useTranslation(['tables', 'messages', 'common'])
    const [confirmState, setConfirmState] = useState<{ anchorEl: HTMLElement; onConfirm: () => void } | null>(null)
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const deleteCategoryFromStore = useCategoriesStore((state) => state.deleteCategory)
    const setSorting = useCategoriesStore((state) => state.setSorting)
    const categoriesOptions = useCategoriesStore((state) => state.categoriesOptions)
    const pagination = useCategoriesStore((state) => state.categoryPagination)
    const setPage = useCategoriesStore((state) => state.setPage)
    const setPageLimit = useCategoriesStore((state) => state.setLimit)

    const deleteCategory = async (id: string) => {
        try {
            await deleteCategoryFromStore(id)
            showSnackbar({ message: t('messages:categoryDeleted'), severity: 'success' })
            if (onCreateSuccess) {
                onCreateSuccess()
            }
        } catch (error) {
            console.error('Failed to delete category:', error)
            showSnackbar({ message: (error as Error).message ?? String(error), severity: 'error' })
        }

    }

    const sortState: TableSortState = {
        sortBy: categoriesOptions.sortBy ?? null,
        sortOrder: categoriesOptions.sortOrder ?? 'asc',
    }

    const rows: CategoryRow[] = categoriesList.map((category, index) => ({
        ...category,
        rowKey: String(category._id ?? category.id ?? index),
    }))

    const columns: TableColumn<CategoryRow>[] = [
        {
            key: '_id',
            label: t('tables:categories.id'),
            render: (_value, category) => (
                <ButtonCopy textToCopy={category._id ?? category.id} />
            ),
            width: '120px',
        },
        {
            key: 'title',
            label: t('tables:categories.title'),
            sortable: true,
            width: '260px',
        },
        {
            key: 'createdAt',
            label: t('tables:categories.createdAt'),
            sortable: true,
            render: (value) =>
                value
                    ? new Date(value).toLocaleDateString(i18n.resolvedLanguage === 'uk' ? 'uk-UA' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                    : t('common:none'),
            width: '170px',
        },
        {
            key: 'image',
            label: t('tables:categories.image'),
            render: (value, category) =>
                value ? (
                    <Box
                        component="img"
                        src={getImageUrl(value)}
                        alt={category.title}
                        sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 1 }}
                    />
                ) : (
                    t('common:none')
                ),
            align: 'center',
            width: '90px',
        },
    ]

    const actions: TableAction<CategoryRow>[] = [
        {
            id: 'view',
            label: t('tables:categories.view'),
            icon: <RemoveRedEyeIcon />,
            color: 'primary',
            testId: 'category-view-btn',
            onClick: (category) => {
                navigate(`/categories/${category._id ?? category.id}`)
            },
        },
        {
            id: 'delete',
            label: t('tables:categories.delete'),
            icon: <DeleteIcon />,
            color: 'error',
            testId: 'category-delete-btn',
            onClick: (category, _index, event) => {
                if (!event) return
                setConfirmState({
                    anchorEl: event.currentTarget,
                    onConfirm: () => void deleteCategory(category._id ?? category.id),
                })
            },
        },
    ]

    return (
        <>
            <TableFactory<CategoryRow>
                data={rows}
                columns={columns}
                actions={actions}
                rowIdKey="rowKey"
                sortState={sortState}
                onSort={(sortBy, sortOrder) => {
                    if (sortBy === null) {
                        setSorting({ sortBy: undefined, sortOrder: undefined })
                        return
                    }
                    if ((sortBy !== 'title' && sortBy !== 'createdAt') || sortOrder === null) return
                    setSorting({ sortBy, sortOrder })
                }}
                paginationState={pagination}
                onPageChange={setPage}
                onLimitChange={setPageLimit}
                emptyMessage={t('tables:empty.categories')}
            />
            <ConfirmPopup
                anchorEl={confirmState?.anchorEl ?? null}
                onClose={() => setConfirmState(null)}
                onConfirm={() => confirmState?.onConfirm()}
            />
        </>
    )
}


export default CategoriesTable
