import { useEffect, useState } from 'react'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { ICategoryInfoDTO } from '../../dto/types/subCategories.dto'
import {
    Drawer, Box, Typography, Button, IconButton,
    TextField, FormControlLabel, Checkbox,
    Divider, Stack, Badge
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import { useProductsStore } from '@/store/productsStore'

interface FilterState {
    search: string
    categoryId: string
    priceMin: number
    priceMax: number
    isOnSale: boolean | null
}

const PRICE_RANGE = [0, 10000]

interface ProductsFilterProps {
    categories: ICategoryInfoDTO[]
}

const ProductsFilter = ({ categories }: ProductsFilterProps) => {
    const { t } = useTranslation(['common', 'filters'])
    const [open, setOpen] = useState(false)
    const setFilters = useProductsStore((state) => state.setFilters)
    const productsOptions = useProductsStore((state) => state.productsOptions)

    const [local, setLocal] = useState<FilterState>({
        search: productsOptions.search ?? '',
        categoryId: productsOptions.categoryId ?? '',
        priceMin: productsOptions.priceMin ?? PRICE_RANGE[0],
        priceMax: productsOptions.priceMax ?? PRICE_RANGE[1],
        isOnSale: productsOptions.isOnSale ?? null,
    })

    useEffect(() => {
        setLocal({
            search: productsOptions.search ?? '',
            categoryId: productsOptions.categoryId ?? '',
            priceMin: productsOptions.priceMin ?? PRICE_RANGE[0],
            priceMax: productsOptions.priceMax ?? PRICE_RANGE[1],
            isOnSale: productsOptions.isOnSale ?? null,
        })
    }, [
        productsOptions.categoryId,
        productsOptions.isOnSale,
        productsOptions.priceMax,
        productsOptions.priceMin,
        productsOptions.search,
    ])

    const activeCount = [
        productsOptions.search?.trim(),
        productsOptions.categoryId,
        productsOptions.isOnSale !== undefined,
        productsOptions.priceMin !== undefined || productsOptions.priceMax !== undefined,
    ].filter(Boolean).length

    const handleApply = () => {
        setFilters({
            search: local.search.trim() || undefined,
            categoryId: local.categoryId || undefined,
            priceMin: local.priceMin > PRICE_RANGE[0] ? local.priceMin : undefined,
            priceMax: local.priceMax < PRICE_RANGE[1] ? local.priceMax : undefined,
            isOnSale: local.isOnSale ?? undefined,
        })
        setOpen(false)

    }

    const handleReset = () => {
        const empty: FilterState = {
            search: '',
            categoryId: '',
            priceMin: PRICE_RANGE[0],
            priceMax: PRICE_RANGE[1],
            isOnSale: null,
        }
        setLocal(empty)
        setFilters({
            search: undefined,
            categoryId: undefined,
            priceMin: undefined,
            priceMax: undefined,
            isOnSale: undefined,
        })
        setOpen(false)

    }



    return (
        <>
            <Badge badgeContent={activeCount} color="primary">
                <Button
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    onClick={() => setOpen(true)}
                    data-testid="products-filter-open-btn"
                >
                    {t('common:filters')}
                </Button>
            </Badge>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 320, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>

                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">{t('common:filters')}</Typography>
                        <IconButton onClick={() => setOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    {/* Search */}
                    <Typography variant="subtitle2" mb={1}>{t('common:searchByName')}</Typography>
                    <TextField
                        size="small"
                        placeholder={t('filters:productPlaceholder')}
                        value={local.search}
                        onChange={(e) => setLocal((p) => ({ ...p, search: e.target.value }))}
                        sx={{ mb: 3 }}
                        slotProps={{ htmlInput: { 'data-testid': 'products-filter-search-input' } }}
                    />

                    {/* Category */}
                    <Typography variant="subtitle2" mb={1}>{t('common:category')}</Typography>
                    <TextField
                        select
                        size="small"
                        value={local.categoryId}
                        onChange={(e) => setLocal((p) => ({ ...p, categoryId: e.target.value }))}
                        sx={{ mb: 3 }}
                        SelectProps={{ native: true }}
                        data-testid="products-filter-category-select"
                    >
                        <option value="">{t('filters:allCategories')}</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.title}</option>
                        ))}
                    </TextField>

                    {/* Price range */}
                    {/* <Typography variant="subtitle2" mb={1}>
                        Ціна: {local.priceMin} — {local.priceMax} ₴
                    </Typography>
                    <Slider
                        value={[local.priceMin, local.priceMax]}
                        min={PRICE_RANGE[0]}
                        max={PRICE_RANGE[1]}
                        onChange={(_e, val) => {
                            const [min, max] = val as number[]
                            setLocal((p) => ({ ...p, priceMin: min, priceMax: max }))
                        }}
                        valueLabelDisplay="auto"
                        sx={{ mb: 3 }}
                    /> */}

                    {/* isOnSale */}
                    <Typography variant="subtitle2" mb={1}>{t('filters:promotionStatus')}</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={local.isOnSale === true}
                                indeterminate={local.isOnSale === null}
                                onChange={(e) =>
                                    setLocal((p) => ({
                                        ...p,
                                        isOnSale: e.target.checked ? true : null,
                                    }))
                                }
                                slotProps={{ input: { 'data-testid': 'products-filter-on-sale-checkbox' } as React.InputHTMLAttributes<HTMLInputElement> }}
                            />
                        }
                        label={t('filters:onlyDiscounted')}
                        sx={{ mb: 3 }}
                    />
                    <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ mb: 2 }} />
                        <Stack direction="row" spacing={1}>
                            <Button fullWidth variant="outlined" onClick={handleReset} data-testid="products-filter-reset-btn">
                                {t('common:reset')}
                            </Button>
                            <Button fullWidth variant="contained" onClick={handleApply} data-testid="products-filter-apply-btn">
                                {t('common:apply')}
                            </Button>
                        </Stack>
                    </Box>

                </Box>
            </Drawer>
        </>
    )
}

export default ProductsFilter