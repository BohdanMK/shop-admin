import { Box, Typography, IconButton } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import getImageUrl from '@/helpers/getImageUrl';

export interface FilePrevData {
    fileId?: string;
    fileName: string;
    filePath?: string;
    fileUrl?: string;
    mimeType?: string;
    size?: number | string;
}

interface FilePrevProps {
    file: FilePrevData;
    onDetelete?: () => void;
}

const getExtension = (name: string) => name.split('.').pop()?.toUpperCase() ?? 'FILE';

const toReadableSize = (size?: number | string) => {
    if (size === undefined || size === null) {
        return '';
    }

    const sizeNumber = typeof size === 'string' ? Number(size) : size;
    if (Number.isNaN(sizeNumber)) {
        return '';
    }

    if (sizeNumber < 1024) {
        return `${sizeNumber} B`;
    }

    const kb = sizeNumber / 1024;
    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;
};

const FilePrev = ({ file, onDetelete  }: FilePrevProps) => {
    const src = file.fileUrl || (file.filePath ? getImageUrl(file.filePath) : '');
    const isImage = file.mimeType?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i.test(file.fileName);

    if (isImage && src) {
        return (
            <Box sx={{ mt: 1, position: 'relative' }}>
                <IconButton
                    color="error"
                    size="small"
                    onClick={onDetelete}
                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
                <img
                    src={src}
                    alt={file.fileName}
                    style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8 }}
                />
                <Typography variant="caption" color="text.secondary">
                    {file.fileName}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                mt: 1,
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}
        >
            <InsertDriveFileIcon color="action" />
            <Box sx={{ flex: 1 }}>
                <Typography variant="body2">{file.fileName}</Typography>
                <Typography variant="caption" color="text.secondary">
                    {getExtension(file.fileName)}{toReadableSize(file.size) ? ` • ${toReadableSize(file.size)}` : ''}
                </Typography>
            </Box>
            <IconButton color="error" size="small" onClick={onDetelete}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

export default FilePrev;