import {
    Box,
    Typography
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import BreadcrumbsList from '@/components/ui/BreadcrumbsList'
import { getLocationDetailsBreadcrumbs } from '@/router/breadcrumbs'
import LocationForm from '@/components/locations/LocationForm'

const CreateLocationsPage = () => {
    const { t } = useTranslation(['common'])
    return (
        <Box>
            <BreadcrumbsList list={getLocationDetailsBreadcrumbs(t, t('common:createLocation'))} />
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {t('common:newLocations')}
                </Typography>
            </Box>
            <LocationForm type="create" />
        </Box>
    )
}

export default CreateLocationsPage