import { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next'
import { Button } from '@mui/material';
import { useUploadsStore, type Upload } from '@/store/uploadsStore';

interface FileUploadFieldProps {
    label?: string;
    onFileChange?: (file: File | null) => void;
    autoUpload?: boolean;
    onUploadSuccess?: (upload: Upload) => void;
    onUploadError?: (error: unknown) => void;
    accept?: string;
    dataTestId?: string;
}

const FileUploadField = ({
    label,
    onFileChange,
    autoUpload = false,
    onUploadSuccess,
    onUploadError,
    accept,
    dataTestId,
}: FileUploadFieldProps) => {
    const { t } = useTranslation(['forms'])
    const resolvedLabel = label ?? t('forms:uploadFiles')
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        onFileChange?.(file);

        if (!autoUpload || !file) {
            return;
        }

        try {
            setIsUploading(true);
            const upload = await useUploadsStore.getState().uploadFile(file);
            onUploadSuccess?.(upload);
        } catch (error) {
            onUploadError?.(error);
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Button
            variant="outlined"
            component="label"
            style={{ height: '48px' }}
            loading={isUploading}
            disabled={isUploading}
            data-testid={dataTestId ? `${dataTestId}-btn` : undefined}
        >
            {resolvedLabel}
            <input
                hidden
                type="file"
                accept={accept}
                onChange={handleChange}
                data-testid={dataTestId ? `${dataTestId}-input` : undefined}
            />
        </Button>
    );
};

export default FileUploadField;
