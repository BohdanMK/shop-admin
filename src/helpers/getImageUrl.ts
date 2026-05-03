const backendBaseUrl = (
    import.meta.env.VITE_API_URL_FILES ??
    import.meta.env.VITE_API_URL ??
    'http://localhost:5000'
)
    .replace(/\/api\/?$/, '')
    .replace(/\/uploads\/?$/, '')
    .replace(/\/$/, '')

const getImageUrl = (image: string) => {
    if (!image) {
        return ''
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image
    }

    const normalizedPath = image
        .replace(/\\/g, '/')
        .replace(/^\/+/, '')
        .replace(/^uploads\/+/, '')

    return `${backendBaseUrl}/uploads/${normalizedPath}`
}

export default getImageUrl