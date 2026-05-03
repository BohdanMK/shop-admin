import {
    FormHelperText,
    TextField,
} from "@mui/material";
import { useTranslation } from 'react-i18next'
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useFormContext } from "react-hook-form";
import type { LocationFormData } from "@/components/locations/LocationForm";
const LocationFormMain = () => {
    const { t } = useTranslation(['forms'])
        const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<LocationFormData>();

     const locationTypeValue = watch("locationType")

    const handleLocationTypeChange = (event: SelectChangeEvent<"restaurant" | "pickup">) => {
             setValue("locationType", event.target.value as "restaurant" | "pickup", {
                 shouldDirty: true,
                 shouldValidate: true,
             })
         }
    return (
        <>
                <TextField
                    label={t('forms:locationName')}
                    fullWidth
                    {...register("name")}
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message ?? ''}
                    slotProps={{ htmlInput: { 'data-testid': 'location-name-input' } }}
                />

                <FormControl fullWidth error={Boolean(errors.locationType)}>
                    <InputLabel id="location-type-label">{t('forms:locationType')}</InputLabel>
                    <Select
                        labelId="location-type-label"
                        value={locationTypeValue}
                        label={t('forms:locationType')}
                        onChange={handleLocationTypeChange}
                        data-testid="location-type-select"
                    >
                        <MenuItem value="restaurant">{t('forms:locationTypeRestaurant')}</MenuItem>
                        <MenuItem value="pickup">{t('forms:locationTypePickup')}</MenuItem>
                    </Select>
                    <FormHelperText>{errors.locationType?.message ?? ''}</FormHelperText>
                </FormControl>



                <TextField
                    label={t('forms:locationAddress')}
                    fullWidth
                    {...register("address")}
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message ?? ''}
                    slotProps={{ htmlInput: { 'data-testid': 'location-address-input' } }}
                />

                <TextField
                    label={t('forms:locationDescription')}
                    fullWidth
                    multiline
                    minRows={3}
                    {...register("description")}
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message ?? ''}
                    slotProps={{ htmlInput: { 'data-testid': 'location-description-input' } }}
                />

                <TextField
                    label={t('forms:locationSchedule')}
                    fullWidth
                    {...register("schedule")}
                    error={Boolean(errors.schedule)}
                    helperText={errors.schedule?.message ?? ''}
                    slotProps={{ htmlInput: { 'data-testid': 'location-schedule-input' } }}
                />
        </>
    )
}

export default LocationFormMain;
