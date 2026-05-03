import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    CircularProgress,
    Typography,
    Stack
} from '@mui/material'
import { useOrdersStore } from '@/store/ordersStore'
import { getOrdersBreadcrumbs } from '@/router/breadcrumbs'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import OrderTable from '@/components/orders/OrdersTable'
import ResultCount from '@/components/ui/ResultCount'
import OrdersFilter from '@/components/orders/OrdersFilter'
import ActiveFiltersList from '@/components/ui/ActiveFiltersList'
import { buildOrdersActiveFilters } from '@/helpers/activeFilters/buildOrdersActiveFilters'

const Orders = () => {
    const { t } = useTranslation(['common'])
    const orders = useOrdersStore((state) => state.orders)
    const isLoading = useOrdersStore((state) => state.isLoading)
    const error = useOrdersStore((state) => state.error)
    const fetchOrders = useOrdersStore((state) => state.fetchOrders)
    const ordersPagination = useOrdersStore((state) => state.ordersPagination)
    const ordersOptions = useOrdersStore((state) => state.ordersOptions)
    const removeFilter = useOrdersStore((state) => state.removeFilter)
    const activeFilters = buildOrdersActiveFilters(ordersOptions)

    useEffect(() => {
        void fetchOrders()
    }, [fetchOrders])

    return (
        <Box>
            <BreadcrumbsList list={getOrdersBreadcrumbs(t)} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:orders')}
                </Typography>
            </Box>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <ResultCount count={ordersPagination.total}/>
                <OrdersFilter />
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
                <Box>
                    <OrderTable
                        orders={orders}
                    />
                </Box>)
            }
        </Box>
    )
}

export default Orders