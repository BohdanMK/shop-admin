import { Button, TextField, IconButton, Stack } from "@mui/material";
import { useFieldArray, Controller, useFormContext } from "react-hook-form";
import type { LocationFormData } from "@/components/locations/LocationForm";
import DeleteIcon from '@mui/icons-material/Delete';

const LocationFormContactsPhone = () => {

    const {
        control,
        formState: { errors },
    } = useFormContext<LocationFormData>();


    const { fields, append, remove } = useFieldArray<LocationFormData>({ control, name: "contactPhones" })

    return (
        <Stack spacing={2}>
            {fields.map((field, index) => (
                <Stack key={field.id + index} direction="row" spacing={2} alignItems="center">
                    <Controller
                        name={`contactPhones.${index}.value`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={`Contact Phone ${index + 1}`}
                                size="small"
                                fullWidth
                                error={!!errors?.contactPhones?.[index]?.value}
                                helperText={errors?.contactPhones?.[index]?.value?.message}
                                inputProps={{ 'data-testid': `location-phone-${index}-input` }}
                            />
                        )}
                    />
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => remove(index)}
                        data-testid={`location-phone-${index}-delete-btn`}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ))}
            <Button variant="outlined" size="small" onClick={() => append({ value: "" })} data-testid="location-add-phone-btn">
                + Додати телефон
            </Button>
        </Stack>
    )
}


export default LocationFormContactsPhone
