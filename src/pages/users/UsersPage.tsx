import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Box,
    CircularProgress,
    Typography,
    Stack
} from '@mui/material'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import ResultCount from '@/components/ui/ResultCount'
import UsersTable from '@/components/users/UsersTable'
import { getUsersBreadcrumbs } from '@/router/breadcrumbs'
import { useUsersStore } from '@/store/usersStore'
import CreateUserPopUp from '@/components/users/popup/UserPopUp'

const UsersPage = () => {
    const { t } = useTranslation(['common'])
    const users = useUsersStore((state) => state.users)
    const isLoading = useUsersStore((state) => state.loading)
    const fetchUsers = useUsersStore((state) => state.fetchUsers)
    const usersTotal = useUsersStore((state) => state.usersPagination.total)

    useEffect(() => {
        void fetchUsers()
    }
    , [fetchUsers])

    return (
        <Box>
            <BreadcrumbsList list={getUsersBreadcrumbs(t)} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:users')}
                </Typography>
            </Box>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <ResultCount count={usersTotal}  />
                <CreateUserPopUp
                    type="create"
                    onUpdateSuccess={() => {
                        void fetchUsers()
                    }}
                />
            </Stack>
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading  && (
                <UsersTable users={users} />
            )
            }
        </Box>
    )
}


export default UsersPage