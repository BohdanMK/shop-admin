import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ProductOptionGroupDTO } from '@/dto/types/products.dto'
import { formatCurrency } from '@/utils/currency'
import ButtonCopy from '@/components/ui/ButtonCopy'
import ProductsOptionsPopUp from '@/components/products/popup/ProductsOptions.tsx'
import DeleteIcon from '@mui/icons-material/Delete'
import { useProductsOptionsStore } from '@/store/productsOptions'
import { useSnackbar } from '@/context/SnackbarContext'
import ConfirmPopup from '@/components/ui/ConfirmPopup'
import {
	Box,
	Chip,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'

interface ProductsOptionsTableProps {
	optionsGroups: ProductOptionGroupDTO[],
    onSuccessUpdate?: () => void
}

const getLimitsLabel = (group: ProductOptionGroupDTO, t: (key: string) => string): string => {
	const hasMin = typeof group.minSelected === 'number'
	const hasMax = typeof group.maxSelected === 'number'

	if (!hasMin && !hasMax) return t('common:none')
	if (hasMin && hasMax) return `${group.minSelected}-${group.maxSelected}`
	if (hasMin) return `${t('tables:productOptions.min')}: ${group.minSelected}`
	return `${t('tables:productOptions.max')}: ${group.maxSelected}`
}

const ProductsOptionsTable = ({ optionsGroups, onSuccessUpdate }: ProductsOptionsTableProps) => {
    const { t } = useTranslation(['tables', 'messages', 'common'])
    const [confirmState, setConfirmState] = useState<{ anchorEl: HTMLElement; onConfirm: () => void } | null>(null)
    const deleteProductOptionGroup = useProductsOptionsStore((state) => state.deleteProductOptionGroup)
        const { showSnackbar } = useSnackbar()
        const handleDelete = async (groupId: string, anchorEl: HTMLElement) => {
            setConfirmState({
                anchorEl,
                onConfirm: async () => {
                    try {
                        await deleteProductOptionGroup(groupId)
                        if (onSuccessUpdate) {
                            onSuccessUpdate()
                        }
                    } catch (error) {
						showSnackbar({ message: (error instanceof Error ? error.message : t('messages:failedDeleteProductOptionGroup')), severity: 'error' })
                    }
                },
            })
        }


	return (
		<>
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>{t('tables:productOptions.id')}</TableCell>
						<TableCell>{t('tables:productOptions.groupName')}</TableCell>
						<TableCell>{t('tables:productOptions.type')}</TableCell>
						<TableCell>{t('tables:productOptions.required')}</TableCell>
						<TableCell>{t('tables:productOptions.limits')}</TableCell>
						<TableCell>{t('tables:productOptions.values')}</TableCell>
                        <TableCell align="center">{t('common:actions')}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{optionsGroups.map((group) => (
						<TableRow key={group.id} hover>
							<TableCell>
								<ButtonCopy textToCopy={group.id} />
							</TableCell>
							<TableCell>{group.name}</TableCell>
							<TableCell>
								<Chip
									size="small"
									label={group.type}
									color={group.type === 'single' ? 'primary' : 'secondary'}
								/>
							</TableCell>
							<TableCell>{group.required ? t('tables:productOptions.yes') : t('tables:productOptions.no')}</TableCell>
							<TableCell>{getLimitsLabel(group, t)}</TableCell>
							<TableCell>
								{group.values.length === 0 ? (
									t('common:none')
								) : (
									<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
										{group.values.map((value) => (
											<Box key={value.id} sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1, '&:last-child': { borderBottom: 0, pb: 0 } }}>
												<Typography variant="body2" sx={{ fontWeight: 600 }}>
													{value.label}
													{value.extraPrice
														? ` (${formatCurrency(value.extraPrice.amount, value.extraPrice.currency)})`
														: ''}
												</Typography>
												{value.description && (
													<Typography variant="caption" color="text.secondary">
														{value.description}
													</Typography>
												)}
											</Box>
										))}
									</Box>
								)}
							</TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <ProductsOptionsPopUp
                                        type='edit'
                                        optionGroupId={group.id}
                                        ProductsOptionsPropsData={group}
                                        onCreateSuccess={() => {
                                            if (onSuccessUpdate) {
                                                onSuccessUpdate()
                                            }
                                        }}
                                    />
                                    <IconButton
                                        onClick={(e) => handleDelete(group.id, e.currentTarget)}
                                    >
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                    </Box>
                            </TableCell>
						</TableRow>
					))}
					{optionsGroups.length === 0 && (
						<TableRow>
							<TableCell colSpan={6} align="center">
								{t('tables:empty.productOptions')}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
		<ConfirmPopup
			anchorEl={confirmState?.anchorEl ?? null}
			onClose={() => setConfirmState(null)}
			onConfirm={() => confirmState?.onConfirm()}
		/>
		</>
	)
}

export default ProductsOptionsTable
