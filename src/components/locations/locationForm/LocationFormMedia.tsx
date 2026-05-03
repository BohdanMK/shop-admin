import { useState } from "react";
import { useTranslation } from 'react-i18next'
import {
    FormHelperText,
    TextField,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "@/context/SnackbarContext"
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import FileUploadField from '@/components/ui/FileUploadField';
import type { LocationFormData } from "@/components/locations/LocationForm";
import type { Upload } from '@/store/uploadsStore';
import FilePrev from '@/components/ui/FilePrev';



const LocationFormMedia = () => {
    const { t } = useTranslation(['forms'])
    const  [uploadedFile, setUploadedFile] = useState<Upload | null>(null);
    const { showSnackbar } = useSnackbar()

    const {
        register,
        setValue,
        getValues,
        watch,
        formState: { errors },
    } = useFormContext<LocationFormData>();

    const imageSrc = watch("mainImg.src");
    const imageAlt = watch("mainImg.alt");

    const handleFileChange = (file: File | null) => {
        if (!file) {
            setValue("mainImg.src", "", { shouldDirty: true, shouldValidate: true })
            setUploadedFile(null)
        }
    }

    const handleUploadSuccess = (upload: Upload) => {
        setValue("mainImg.src", upload.filePath || upload.fileUrl, { shouldDirty: true, shouldValidate: true })
        if (!getValues("mainImg.alt")) {
            setValue("mainImg.alt", upload.fileName, { shouldDirty: true })
        }
        setUploadedFile(upload)
    }

    const handleUploadError = (error: unknown) => {
        setValue("mainImg.src", "", { shouldDirty: true, shouldValidate: true })
        setUploadedFile(null)
        showSnackbar({ message: extractErrorMessage(error, 'File upload failed'), severity: 'error' })
    }

    const handleDeletePreview = () => {
        setValue("mainImg.src", "", { shouldDirty: true, shouldValidate: true })
        setUploadedFile(null)
    }

    return (
        <>
                {imageSrc ? (
                <FilePrev
                    file={
                        uploadedFile
                            ? uploadedFile
                            : {
                                fileName: imageSrc.split("/").pop() || imageAlt || t('forms:locationImages'),
                                filePath: imageSrc,
                                fileUrl: imageSrc.startsWith("http") ? imageSrc : undefined,
                                mimeType: "image/*",
                            }
                    }
                    onDetelete={handleDeletePreview}
                />
            ) : null}

            <FileUploadField
                label={t('forms:uploadLocationImage')}
                onFileChange={handleFileChange}
                accept="image/*"
                autoUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                dataTestId="location-image-upload"
            />
            {errors.mainImg?.src?.message ? (
                <FormHelperText error>{errors.mainImg.src.message}</FormHelperText>
            ) : null}

            <TextField
                label={t('forms:productImageAlt')}
                fullWidth
                {...register("mainImg.alt")}
                error={Boolean(errors.mainImg?.alt)}
                helperText={errors.mainImg?.alt?.message ?? ''}
                slotProps={{ htmlInput: { 'data-testid': 'location-image-alt-input' } }}
            />
        </>
    )
}

export default LocationFormMedia;
