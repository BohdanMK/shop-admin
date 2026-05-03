import { useState, useEffect } from "react";
import {
    FormHelperText,
} from "@mui/material";
import type { ProductFormValues } from "@/components/product/ProductForm";
import type { ProductDTO } from "@/dto/types/products.dto";
import { useSnackbar } from "@/context/SnackbarContext"
import { useFormContext } from "react-hook-form";
import { extractErrorMessage } from "@/helpers/extractErrorMessage";
import FileUploadField from '@/components/ui/FileUploadField';
import type { Upload } from '@/store/uploadsStore';
import FilePrev from '@/components/ui/FilePrev';

interface ProductFormMediaProps {
    product?: ProductDTO;
    getDefaultValues: (product?: ProductDTO) => ProductFormValues;
}

const ProductFormMedia = ({ product, getDefaultValues }: ProductFormMediaProps) => {
    const [uploadedFile, setUploadedFile] = useState<Upload | null>(null);
    const { showSnackbar } = useSnackbar()

    const {
        setValue,
        getValues,
        watch,
        reset,
        formState: { errors },
    } = useFormContext<ProductFormValues>();

    const imageSrc = watch("image.src");
    const imageAlt = watch("image.alt");

        const handleFileChange = (file: File | null) => {
        if (!file) {
            setValue("image.src", "", { shouldDirty: true, shouldValidate: true });
            setUploadedFile(null);
        }
    };

    const handleUploadSuccess = (upload: Upload) => {
        setValue("image.src", upload.filePath || upload.fileUrl, { shouldDirty: true, shouldValidate: true });
        if (!getValues("image.alt")) {
            setValue("image.alt", upload.fileName, { shouldDirty: true });
        }
        setUploadedFile(upload);
        console.log('Upload successful, file ID:', upload.fileId, 'file path:', upload.filePath);
    };

    const handleUploadError = (error: unknown) => {
        setValue("image.src", "", { shouldDirty: true, shouldValidate: true });
        setUploadedFile(null);
        const errorMessage = extractErrorMessage(error, 'File upload failed');
        showSnackbar({ message: errorMessage, severity: 'error' });
    };

    const handleDeletePreview = () => {
        setValue("image.src", "", { shouldDirty: true, shouldValidate: true });
        setUploadedFile(null);
    };

    useEffect(() => {
        reset(getDefaultValues(product));
        setUploadedFile(null);
    }, [getDefaultValues, product, reset]);

    return (
        <>
            {imageSrc ? (
                <FilePrev
                    file={
                        uploadedFile
                            ? uploadedFile
                            : {
                                    fileName: imageSrc.split("/").pop() || imageAlt || "Product image",
                                    filePath: imageSrc,
                                    fileUrl: imageSrc.startsWith("http") ? imageSrc : undefined,
                                    mimeType: "image/*",
                            }
                    }
                    onDetelete={handleDeletePreview}
                />
            ) : null}
            <FileUploadField
                label="Upload product image"
                onFileChange={handleFileChange}
                accept="image/*"
                autoUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                dataTestId="product-image-upload"
            />
            {errors.image?.src?.message ? (
                <FormHelperText error>{errors.image.src.message}</FormHelperText>
            ) : null}
        </>
    )
}

export default ProductFormMedia;