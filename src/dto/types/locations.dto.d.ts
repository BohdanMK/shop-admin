type LocationType = 'restaurant' | 'pickup'
type LocationImage = string

export interface Location {
    _id?: number
    id?: number
    name: string
    locationType: LocationType
    lat: number
    lng: number,
    mainImg: { src: string; alt: string },
    address?: string
    description?: string,
    mapStyle?: string,
    images?: LocationImage[],
    schedule?: string,
    contactPhones?:  { value: string }[]
}