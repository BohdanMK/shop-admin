import { Stack } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { ProductComponentsFormValues } from "@/components/product/ProductComponentForm";
import FileUploadField from '@/components/ui/FileUploadField';
import type { Upload } from '@/store/uploadsStore';
import FilePrev from '@/components/ui/FilePrev';

interface ProductComponentFormMediaProps {
    index: number;
    imageSrc: string;
    imageAlt: string;
    uploadedFile: Upload | null;
    onDeletePreview: () => void;
    onUploadSuccess: (upload: Upload) => void;
    onUploadError: (error: unknown) => void;
}

const ProductComponentFormMedia = ({
    index,
    imageSrc,
    imageAlt,
    uploadedFile,
    onDeletePreview,
    onUploadSuccess,
    onUploadError,
}: ProductComponentFormMediaProps) => {
    const { setValue, getValues } = useFormContext<ProductComponentsFormValues>();

    const handleFileChange = (file: File | null) => {
        if (!file) {
            setValue(`components.${index}.image.src`, "", { shouldDirty: true, shouldValidate: true });
        }
    };

    const handleUploadSuccess = (upload: Upload) => {
        setValue(`components.${index}.image.src`, upload.filePath || upload.fileUrl, {
            shouldDirty: true,
            shouldValidate: true,
        });
        if (!getValues(`components.${index}.image.alt`)) {
            setValue(`components.${index}.image.alt`, upload.fileName, { shouldDirty: true });
        }
        onUploadSuccess(upload);
        console.log(`Component ${index} upload successful:`, upload);
    };

    const handleUploadError = (error: unknown) => {
        console.error(`Component ${index} upload failed:`, error);
        setValue(`components.${index}.image.src`, "", { shouldDirty: true, shouldValidate: true });
        onUploadError(error);
    };

    return (
        <Stack spacing={1} flex={1}>
            {imageSrc ? (
                <FilePrev
                    file={
                        uploadedFile
                            ? uploadedFile
                            : {
                                    fileName: imageSrc.split("/").pop() || imageAlt || "Component image",
                                    filePath: imageSrc,
                                    fileUrl: imageSrc.startsWith("http") ? imageSrc : undefined,
                                    mimeType: "image/*",
                            }
                    }
                    onDetelete={onDeletePreview}
                />
            ) : null}
            <FileUploadField
                label="Upload component image"
                onFileChange={handleFileChange}
                accept="image/*"
                autoUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                dataTestId={`component-image-upload`}
            />
        </Stack>
    );
};

export default ProductComponentFormMedia;
