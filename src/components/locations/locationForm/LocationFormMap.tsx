import { useEffect, memo } from "react";
import { useTranslation } from 'react-i18next'
import {
    Stack,
    TextField,

} from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { UseFormSetValue } from "react-hook-form";
import type { LocationFormData } from "@/components/locations/LocationForm";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

type MapCenterSyncProps = {
    lat: number;
    lng: number;
};

const MapCenterSync = memo(({ lat, lng }: MapCenterSyncProps) => {
    const map = useMap();

    useEffect(() => {
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
    map.setView([lat, lng], map.getZoom());
    }
    }, [lat, lng, map]);

    return null;
});

type MapClickHandlerProps = {
    setValue: UseFormSetValue<LocationFormData>;
};

const MapClickHandler = memo(({ setValue }: MapClickHandlerProps) => {
    useMapEvents({
        click(e) {
            setValue("lat", e.latlng.lat, { shouldDirty: true, shouldValidate: true });
            setValue("lng", e.latlng.lng, { shouldDirty: true, shouldValidate: true });
        },
    });
    return null;
});


const LocationFormMap = () => {
    const { t } = useTranslation(['forms'])

    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<LocationFormData>();

    const lngValue = watch("lng");
    const latValue = watch("lat");



    return (
        <>
          <MapContainer center={[latValue, lngValue]} zoom={14} style={{ height: 400 }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latValue, lngValue]} />
            <MapClickHandler setValue={setValue} />
            <MapCenterSync lat={latValue} lng={lngValue} />
        </MapContainer>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>

                    <TextField
                        label={t('forms:latitude')}
                        type="number"
                        fullWidth
                        {...register("lat", {
                            setValueAs: (value) => Number(value) || 0,
                        })}
                        error={Boolean(errors.lat)}
                        helperText={errors.lat?.message ?? ''}
                        slotProps={{ htmlInput: { 'data-testid': 'location-lat-input' } }}
                    />
                <TextField
                    label={t('forms:longitude')}
                        type="number"
                        fullWidth
                        {...register("lng", {
                            setValueAs: (value) => Number(value) || 0,
                        })}
                        error={Boolean(errors.lng)}
                        helperText={errors.lng?.message ?? ''}
                        slotProps={{ htmlInput: { 'data-testid': 'location-lng-input' } }}
                    />
            </Stack>
        </>

    )
}

export default LocationFormMap;
