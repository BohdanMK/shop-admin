import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { IOrderInfoDTO } from '@/dto/types/orders.dto'
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Collapse,
    IconButton,
    FormControl,
    MenuItem,
    Select,
} from '@mui/material'
import { useSnackbar } from '@/context/SnackbarContext'
import { useOrdersStore } from '@/store/ordersStore'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatCurrency } from '@/utils/currency';
import TableFactory from '@/components/ui/table/TableFactory'
import type { TableColumn, TableSortState } from '@/components/ui/table/types'

interface OrdersTableProps {
    orders: IOrderInfoDTO[]
}

type OrderRow = IOrderInfoDTO & { rowKey: string }

const OrderTable = ({ orders }: OrdersTableProps) => {
    const { t, i18n } = useTranslation(['tables', 'messages', 'common'])
    const { showSnackbar } = useSnackbar()
    const buildStatuses = (source: IOrderInfoDTO[]) =>
        Object.fromEntries(
            source
                .filter((order) => Boolean(order._id))
                .map((order) => [order._id as string, order.status ?? ''])
        )

    const [openRows, setOpenRows] = useState<Set<string>>(new Set())
    const [localStatuses, setLocalStatuses] = useState<Record<string, string>>(() => buildStatuses(orders))
    const ordersOptions = useOrdersStore((state) => state.ordersOptions)
    const setSorting = useOrdersStore((state) => state.setSorting)
    const updateOrderStatus = useOrdersStore((state) => state.updateOrderStatus)

    const pagination = useOrdersStore((state) => state.ordersPagination)
    const setPage = useOrdersStore((state) => state.setPage)
    const setPageLimit = useOrdersStore((state) => state.setLimit)

    const rows = useMemo<OrderRow[]>(
        () =>
            orders.map((order, index) => ({
                ...order,
                rowKey: order._id ?? `${order.phone}-${order.createdAt ?? index}`,
            })),
        [orders]
    )

    useEffect(() => {
        setLocalStatuses(buildStatuses(orders))
    }, [orders])

    const sortState: TableSortState = {
        sortBy:
            ordersOptions.sortBy === 'createdAt' || ordersOptions.sortBy === 'total'
                ? ordersOptions.sortBy
                : null,
        sortOrder: ordersOptions.sortOrder ?? 'asc',
    }

    const toggleRow = (id: string) => {
        setOpenRows(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handlerUdateStatus = async (orderId: string, status: string) => {
        setLocalStatuses((prev) => ({ ...prev, [orderId]: status }))
        try {
            await updateOrderStatus(orderId, status)
            showSnackbar({ message: t('messages:orderStatusUpdated'), severity: 'success' })
        } catch (error) {
            setLocalStatuses((prev) => ({ ...prev, [orderId]: orders.find((o) => o._id === orderId)?.status ?? '' }))
            console.error('Failed to update order status:', error)
            showSnackbar({ message: t('messages:orderStatusUpdateFailed'), severity: 'error' })
        }
    }


    const columns: TableColumn<OrderRow>[] = [
        {
            key: 'expand',
            label: '',
            render: (_value, row) => (
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={(event) => {
                        event.stopPropagation()
                        toggleRow(row.rowKey)
                    }}
                >
                    {openRows.has(row.rowKey) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            ),
            align: 'center',
            width: '56px',
        },
        {
            key: 'name',
            label: t('tables:orders.name'),
            width: '180px',
        },
        {
            key: 'phone',
            label: t('tables:orders.phone'),
            width: '140px',
        },
        {
            key: 'cityName',
            label: t('tables:orders.city'),
            render: (value) => value || t('common:notAvailable'),
            width: '160px',
        },
        {
            key: 'createdAt',
            label: t('tables:orders.createdAt'),
            sortable: true,
            render: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage === 'uk' ? 'uk-UA' : 'en-US') : t('common:notAvailable')),
            width: '190px',
        },
        {
            key: 'total',
            label: t('tables:orders.totalPrice'),
            sortable: true,
            render: (_value, row) => formatCurrency(row.cartSnapshot.totalPrice, 'UAH'),
            align: 'right',
            width: '140px',
        },
        {
            key: 'status',
            label: t('tables:orders.status'),
            render: (_value, row) =>
                row._id ? (
                    <FormControl size="small" fullWidth>
                        <Select
                            value={localStatuses[row._id] ?? ''}
                            onChange={(event) =>
                                handlerUdateStatus(
                                    row._id!,
                                    event.target.value as 'pending' | 'confirmed' | 'processing'
                                )
                            }
                        >
                            <MenuItem value="pending">{t('tables:orders.pending')}</MenuItem>
                            <MenuItem value="confirmed">{t('tables:orders.confirmed')}</MenuItem>
                            <MenuItem value="processing">{t('tables:orders.processing')}</MenuItem>
                        </Select>
                    </FormControl>
                ) : (
                    t('common:notAvailable')
                ),
            width: '180px',
        },
        {
            key: 'details',
            label: t('tables:orders.details'),
            render: (_value, row) => (
                <Collapse in={openRows.has(row.rowKey)} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                        <Typography variant="subtitle2" gutterBottom component="div">
                            {t('tables:orders.orderDetails')}
                        </Typography>
                        <Table size="small" aria-label="order-details">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('tables:orders.productName')}</TableCell>
                                    <TableCell>{t('tables:products.price')}</TableCell>
                                    <TableCell>{t('tables:orders.quantity')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.cartSnapshot.items.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell>{formatCurrency(item.price.amount, item.price.currency)}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            ),
            width: '320px',
        },
    ]

    return (
        <TableFactory<OrderRow>
            data={rows}
            columns={columns}
            rowIdKey="rowKey"
            sortState={sortState}
            onSort={(sortBy, sortOrder) => {
                if (sortBy === null) {
                    setSorting({ sortBy: undefined, sortOrder: undefined })
                    return
                }
                if ((sortBy !== 'createdAt' && sortBy !== 'total') || sortOrder === null) return
                setSorting({ sortBy, sortOrder })
            }}
            paginationState={pagination}
            onPageChange={setPage}
            onLimitChange={setPageLimit}
            emptyMessage={t('tables:empty.orders')}
        />
    )
}


export default OrderTable