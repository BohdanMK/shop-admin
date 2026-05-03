import { useTranslation } from 'react-i18next'

const LocationImages = () => {
    const { t } = useTranslation(['forms'])
    return (
        <div>
            <h2>{t('forms:locationImages')}</h2>
            <p>{t('forms:locationImagesHint')}</p>
        </div>
    )
}

export default LocationImages