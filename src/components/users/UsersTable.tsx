import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { UserDTO } from '@/dto/types/users.dto'
import Stack from '@mui/material/Stack';
import ButtonCopy from '@/components/ui/ButtonCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from '@/context/SnackbarContext'
import { useUsersStore } from '@/store/usersStore'
import UserPopUp from '@/components/users/popup/UserPopUp'
import TableFactory from '@/components/ui/table/TableFactory'
import type { TableAction, TableColumn, TableSortState } from '@/components/ui/table/types'
import ConfirmPopup from '@/components/ui/ConfirmPopup'

interface UsersTableProps {
    users: UserDTO[];
}

const UsersTable = ({ users }: UsersTableProps) => {
    const { t, i18n } = useTranslation(['tables', 'messages', 'common'])
    const [confirmState, setConfirmState] = useState<{ anchorEl: HTMLElement; onConfirm: () => void } | null>(null)
    const { showSnackbar } = useSnackbar()

    const deleteUserFromStore = useUsersStore((state) => state.deleteUser)
    const pagination = useUsersStore((state) => state.usersPagination)
    const setPage = useUsersStore((state) => state.setPage)
    const setPageLimit = useUsersStore((state) => state.setLimit)
    const setSorting = useUsersStore((state) => state.setSorting)
    const usersOptions = useUsersStore((state) => state.usersOptions)

    const deleteUser = async (id: string) => {
        try {
            await deleteUserFromStore(id)
            showSnackbar({ message: t('messages:userDeleted'), severity: 'success' })
        } catch (error) {
            console.error('Failed to delete user:', error)
            showSnackbar({ message: (error as Error).message ?? String(error), severity: 'error' })
        }
    }

    const sortState: TableSortState = {
        sortBy: usersOptions.sortBy ?? null,
        sortOrder: usersOptions.sortOrder ?? 'asc',
    }

    const columns: TableColumn<UserDTO>[] = [
        {
            key: '_id',
            label: t('tables:users.id'),
            render: (value) => (value ? <ButtonCopy textToCopy={value} /> : t('common:notAvailable')),
            width: '120px',
        },
        {
            key: 'name',
            label: t('tables:users.name'),
            sortable: true,
            width: '180px',
        },
        {
            key: 'userName',
            label: t('tables:users.userName'),
            width: '180px',
        },
        {
            key: 'email',
            label: t('tables:users.email'),
            sortable: true,
            width: '240px',
        },
        {
            key: 'role',
            label: t('tables:users.role'),
            width: '130px',
        },
        {
            key: 'createdAt',
            label: t('tables:users.createdAt'),
            sortable: true,
            render: (value) => (value ? new Date(value).toLocaleString(i18n.resolvedLanguage === 'uk' ? 'uk-UA' : 'en-US') : t('common:notAvailable')),
            width: '190px',
        }
    ]

    const actions: TableAction<UserDTO>[] = [
        {
            id: 'edit',
            label: t('tables:users.editUser'),
            render: (_user) => (
                <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                    <UserPopUp type="edit" user={_user} userId={_user._id} />
                </Stack>
                ),
        },
        {
            id: 'delete',
            label: t('tables:users.deleteUser'),
            icon: <DeleteIcon />,
            color: 'error',
            visible: (user) => Boolean(user._id),
            onClick: (user, _index, event) => {
                if (!user._id || !event) return
                const userId = user._id
                setConfirmState({
                    anchorEl: event.currentTarget,
                    onConfirm: () => void deleteUser(userId),
                })
            },
        },
    ]

    return (
        <>
            <TableFactory<UserDTO>
                data={users}
                columns={columns}
                actions={actions}
                rowIdKey="_id"
                sortState={sortState}
                onSort={(sortBy, sortOrder) => {
                    if (sortBy === null) {
                        setSorting({ sortBy: undefined, sortOrder: undefined })
                        return
                    }
                    if (
                        (sortBy !== 'name' && sortBy !== 'email' && sortBy !== 'createdAt') ||
                        sortOrder === null
                    ) {
                        return
                    }
                    setSorting({ sortBy, sortOrder })
                }}
                paginationState={pagination}
                onPageChange={setPage}
                onLimitChange={setPageLimit}
                emptyMessage={t('tables:empty.users')}
            />
            <ConfirmPopup
                anchorEl={confirmState?.anchorEl ?? null}
                onClose={() => setConfirmState(null)}
                onConfirm={() => confirmState?.onConfirm()}
            />
        </>
    )
}

export default UsersTable