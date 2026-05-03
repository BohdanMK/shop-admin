import { useEffect } from "react";
import { useTranslation } from 'react-i18next'
import { useNavigate } from "react-router-dom"
import { useLocationsStore } from "@/store/locationsStore";
import {
    Box,
    CircularProgress,
    Typography,
    Stack,
    Button,
    Alert
} from '@mui/material'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import ResultCount from '@/components/ui/ResultCount'
import LocationsTable from '@/components/locations/LocationsTable'
import { getLocationsBaseBreadcrumbs } from '@/router/breadcrumbs'


const Locations = () => {
    const { t } = useTranslation(['common'])
    const navigate = useNavigate()
    const fetchLocations = useLocationsStore((state) => state.fetchLocations)
    const locations = useLocationsStore((state) => state.locations)
    const isLoading = useLocationsStore((state) => state.loading)
    const error = useLocationsStore((state) => state.error)
    const locationsTotal = useLocationsStore((state) => state.locationsPagination.total)

    const goToCreate = () => {
        navigate("/locations/new")
    }

    useEffect(() => {
            void fetchLocations()
    }, [fetchLocations])
    return (
        <Box>
            <BreadcrumbsList list={getLocationsBaseBreadcrumbs(t)} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:locations')}
                </Typography>
            </Box>
            <Stack direction="row" justifyContent="space-between" mb={2}>
                <ResultCount count={locationsTotal}  />
                <Button
                    variant="outlined"
                    onClick={goToCreate}
                >
                    {t('common:createLocation')}
                </Button>
            </Stack>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && locations && (
                <LocationsTable locations={locations} />
            )
            }
        </Box>
    );
}

export default Locations;