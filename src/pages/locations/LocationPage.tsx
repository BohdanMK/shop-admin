import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from "react-router-dom";
import {
    Box,
    Typography
} from '@mui/material'
import { useLocationsStore } from "@/store/locationsStore";
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import { getLocationDetailsBreadcrumbs } from '@/router/breadcrumbs'
import LocationForm from '@/components/locations/LocationForm'

const LocationPage = () => {
    const { t } = useTranslation(['common'])
    const { id } = useParams()
    const fetchLocationById = useLocationsStore((state) => state.getLocationById)
    const Location = useLocationsStore((state) => state.Location)
    const loading = useLocationsStore((state) => state.loading)
    const error = useLocationsStore((state) => state.error)

    const breadCrumbs = getLocationDetailsBreadcrumbs(t, Location ? Location.name : t('common:location'))

    useEffect(() => {
        void fetchLocationById(id!)
    }, [fetchLocationById])

    return (
        <Box>
            <BreadcrumbsList list={breadCrumbs} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {Location ? Location.name : t('common:location')}
                </Typography>
            </Box>
            {loading ? <Typography sx={{ mb: 2 }}>{t('common:loading')}</Typography> : null}
            {error ? (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            ) : null}
            { !loading && Location && (
                <LocationForm
                        type="edit"
                        location={Location}
                    />
            )}

        </Box>
    )
}

export default LocationPage