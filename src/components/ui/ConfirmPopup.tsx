import { Popover, Button, Typography, Box } from "@mui/material";
import { useTranslation } from 'react-i18next'

interface ConfirmPopupProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onConfirm: () => void;
  message?: string;
}

export default function ConfirmPopup({
  anchorEl,
  onClose,
  onConfirm,
  message,
}: ConfirmPopupProps) {
  const { t } = useTranslation(['common'])
  const resolvedMessage = message ?? t('common:confirmDelete')

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Box p={2}>
        <Typography>{resolvedMessage}</Typography>
        <Box mt={1} display="flex" gap={1}>
          <Button
            color="error"
            size="small"
            variant="contained"
            data-testid="confirm-yes-btn"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {t('common:yes')}
          </Button>
          <Button size="small" data-testid="confirm-no-btn" onClick={onClose}>
            {t('common:no')}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
