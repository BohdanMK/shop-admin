
import { useSnackbar } from '@/context/SnackbarContext'
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useTranslation } from 'react-i18next'


const ButtonCopy = ({ textToCopy }: { textToCopy: string }) => {
    const { t } = useTranslation(['messages'])
    const { showSnackbar } = useSnackbar()
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                showSnackbar({ message: t('messages:textCopied'), severity: 'success' })
            })
            .catch(() => {
                showSnackbar({ message: t('messages:textCopyFailed'), severity: 'error' })

            })
    }

    return (
        <IconButton onClick={handleCopy} aria-label="copy">
            <ContentCopyIcon />
        </IconButton>
    )
}

export default ButtonCopy