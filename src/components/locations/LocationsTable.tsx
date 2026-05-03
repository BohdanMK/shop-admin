import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLocationsStore } from '@/store/locationsStore'
import { useSnackbar } from '@/context/SnackbarContext'
import type { Location } from '@/dto/types/locations.dto'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableFactory from '@/components/ui/table/TableFactory'
import type { TableAction, TableColumn, TableSortState } from '@/components/ui/table/types'
import ConfirmPopup from '@/components/ui/ConfirmPopup'
interface LocationsTableProps {
    locations: Location[]
}

type LocationRow = Location & { rowKey: string }

const LocationsTable = ({ locations }: LocationsTableProps) => {
    const { t } = useTranslation(['tables', 'messages', 'common'])
    const [confirmState, setConfirmState] = useState<{ anchorEl: HTMLElement; onConfirm: () => void } | null>(null)
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const paginations = useLocationsStore((state) => state.locationsPagination)
    const options = useLocationsStore((state) => state.locationsOptions)
    const setPage = useLocationsStore((state) => state.setPage)
    const setLimit = useLocationsStore((state) => state.setLimit)
    const deleteLocation = useLocationsStore((state) => state.deleteLocation)

    const rows: LocationRow[] = locations.map((location, index) => ({
        ...location,
        rowKey: String(location._id ?? location.id ?? index),
    }))

    const sortState: TableSortState = {
        sortBy:
            options.sortBy === 'name' || options.sortBy === 'locationType'
                ? options.sortBy
                : null,
        sortOrder: options.sortOrder ?? 'asc',
    }

    const deleteItem = async (id: string) => {
        try {
            await deleteLocation(id)
            showSnackbar({ message: t('messages:locationDeleted'), severity: 'success' })
        } catch (error) {
            showSnackbar({ message: (error as Error).message ?? String(error), severity: 'error' })
        }
    }


    const columns: TableColumn<LocationRow>[] = [
        {
            key: 'name',
            label: t('tables:locations.name'),
            width: '200px',
        },
        {
            key: 'locationType',
            label: t('tables:locations.locationType'),
            width: '160px',
        },
        {
            key: 'coordinates',
            label: t('tables:locations.coordinates'),
            render: (_value, location) => `${location.lat}, ${location.lng}`,
            width: '180px',
        },
        {
            key: 'address',
            label: t('tables:locations.address'),
            render: (value) => value || t('common:none'),
            width: '260px',
        },
        {
            key: 'contactPhones',
            label: t('tables:locations.contactPhones'),
            render: (value) => {
                if (!Array.isArray(value) || value.length === 0) return t('common:none')
                return value
                    .map((phone) => (typeof phone === 'string' ? phone : phone?.value))
                    .filter(Boolean)
                    .join(', ')
            },
            width: '240px',
        },
    ]

    const actions: TableAction<LocationRow>[] = [
        {
            id: 'edit',
            label: t('tables:locations.editLocation'),
            color: 'primary',
            icon: <EditIcon />,
            onClick: (location) => {
                navigate(`/locations/${location._id ?? location.id}`)
            },
        },
        {
            id: 'delete',
            label: t('tables:locations.deleteLocation'),
            icon: <DeleteIcon />,
            color: 'error',
            onClick: (location, _index, event) => {
                if (!location._id && !location.id) {
                    showSnackbar({ message: t('messages:locationIdMissing'), severity: 'error' })
                    return
                }
                if (event) {
                    setConfirmState({
                        anchorEl: event.currentTarget,
                        onConfirm: () => void deleteItem(String(location._id ?? location.id)),
                    })
                }
            },
        },


    ]

    return (
        <>
            <TableFactory<LocationRow>
                data={rows}
                columns={columns}
                actions={actions}
                rowIdKey="rowKey"
                sortState={sortState}
                paginationState={paginations}
                onPageChange={setPage}
                onLimitChange={setLimit}
                emptyMessage={t('tables:empty.locations')}
            />
            <ConfirmPopup
                anchorEl={confirmState?.anchorEl ?? null}
                onClose={() => setConfirmState(null)}
                onConfirm={() => confirmState?.onConfirm()}
            />
        </>
    )

}

export default LocationsTable