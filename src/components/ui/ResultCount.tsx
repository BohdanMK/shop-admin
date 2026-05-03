import { Typography } from "@mui/material";
import { useTranslation } from 'react-i18next'

const ResultCount = ({ count }: { count: number }) => {
    const { t } = useTranslation(['common'])

    return (
        <Typography color="textSecondary">
            {t('common:results', { count })}
        </Typography>
    );
};

export default ResultCount;