import { useRoutes } from 'react-router-dom'
import { Suspense } from 'react'
import { CircularProgress, Box } from '@mui/material'
import { routes } from './routes'

export const AppRouter = () => {
    const element = useRoutes(routes)

    return (
        <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" width="100vw" height="100vh">
                <CircularProgress />
            </Box>
        }>
        {element}
        </Suspense>
    )
}