import { useEffect } from "react";
import type { Location } from "@/dto/types/locations.dto";
import {
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext"
import { useLocationsStore } from "@/store/locationsStore";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LocationFormContactsPhone from "@/components/locations/locationForm/LocationFormContactsPhone";
import LocationFormMedia from "@/components/locations/locationForm/LocationFormMedia";
import LocationFormMap from "@/components/locations/locationForm/LocationFormMap";
import LocationFormMain from "@/components/locations/locationForm/LocationFormMain";


type typeForm = "create" | "edit";

export type LocationFormData = z.infer<typeof createLocationSchema>

interface LocationFormProps {
    type: typeForm;
    location?: Location;
    onSubmit?: (data: LocationFormData) =>  Promise<void> | void;
}

const createLocationSchema = z.object({
    name: z.string().min(1, "Назва обов'язкова"),
    locationType: z.union([
        z.literal("restaurant"),
        z.literal("pickup"),
    ]),
    lat: z.number(),
    lng: z.number(),
    mainImg: z.object({
        src: z.string().trim().min(1, 'Product image is required'),
        alt: z.string().trim().min(1, 'Image alt text is required'),
    }),
    address: z.string().min(1, "Адреса обов'язкова"),
    description: z.string().min(1, "Опис обов'язковий"),
    schedule: z.string().min(1, "Графік роботи обов'язковий"),
    contactPhones: z.array(
        z.object({
            value: z.string().min(1, "Номер телефону обов'язковий")
        })
    ).min(1, "Додайте хоча б один номер телефону"),

});

const getDefaultValues = (type: typeForm, location?: Location) => {
    if (type === "edit" && location) {
        return {
            name: location.name,
            locationType: location.locationType as "restaurant" | "pickup",
            lat: location.lat ?? 50,
            lng: location.lng ?? 30,
            mainImg: location.mainImg,
            address: location.address || "",
            description: location.description || "",
            schedule: location.schedule || "",
            contactPhones: location.contactPhones && location.contactPhones.length > 0                ? location.contactPhones
                : [{ value: "" }],
        }
    }
    return {
        name: "",
        locationType: "restaurant" as "restaurant" | "pickup",
        lat: 50,
        lng: 50,
        mainImg: { src: "", alt: "" },
        address: "",
        description: "",
        schedule: "",
        contactPhones: [{ value: "" }],
    }
}




const LocationForm = ({ type, location, onSubmit: onSubmitProp }: LocationFormProps) => {
    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const createLocation = useLocationsStore((state) => state.createLocation)
    const updateLocation = useLocationsStore((state) => state.updateLocation)
    const loadingCreate = useLocationsStore((state) => state.loadingCreate)
    const loadingUpdate = useLocationsStore((state) => state.loadingUpdate)

    const methods = useForm<LocationFormData>({
        resolver: zodResolver(createLocationSchema),
        defaultValues: getDefaultValues(type, location),
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;



    const handleFormSubmit = async (data: LocationFormData) => {
        try {
            if (onSubmitProp) {
                await onSubmitProp(data)
            } else if (type === "create") {
                await createLocation(data)
                navigate('/locations')
            } else {
                const locationId = location?._id ?? location?.id
                if (!locationId) {
                    throw new Error('Location id is missing')
                }
                await updateLocation(locationId, data)
            }

            showSnackbar({
                message: type === "create" ? "Локацію створено" : "Локацію оновлено",
                severity: "success",
            })

        } catch (error) {
            showSnackbar({
                message: extractErrorMessage(error, type === "create" ? 'Не вдалося створити локацію' : 'Не вдалося оновити локацію'),
                severity: 'error',
            })
        }
    }



    useEffect(() => {
        reset(getDefaultValues(type, location))
    }, [type, location?._id, reset])

    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2, width: "60%", marginX: "auto" }}
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <Typography variant="h6">
                    {type === "create" ? "Create Location" : "Edit Location"}
                </Typography>
                <LocationFormMain />
                <LocationFormMedia />
                <LocationFormMap />
                <LocationFormContactsPhone />

                <Stack direction="row" justifyContent="flex-end">
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || loadingCreate || loadingUpdate}
                        data-testid="location-submit-btn"
                    >
                        {type === "create" ? "Створити локацію" : "Зберегти зміни"}
                    </Button>
                </Stack>
            </Box>
        </FormProvider>
    )
}

export default LocationForm;