import {create} from 'zustand'
import { getLocationsApi, createLocationApi, updateLocationApi, deleteLocationApi, getLocationByIdApi } from '@/api/locations'
import type { Location } from '@/dto/types/locations.dto'
import type { PaginationState } from '@/types/pagination'

interface LocationsOptions {
    page?: number;
    limit?: number;
    name?: string;
    locationType?: string;
    sortBy?: 'name' | 'locationType';
    sortOrder?: 'asc' | 'desc';
}

interface LocationsState {
    locations: Location[]
    Location: Location | null
    loading: boolean
    loadingCreate: boolean
    loadingUpdate: boolean
    loadingDelete: boolean
    error: string | null
    errorCreate: string | null
    errorUpdate: string | null
    errorDelete: string | null
    locationsPagination: PaginationState
    locationsOptions: LocationsOptions
    fetchLocations: () => Promise<void>
    setPage: (page: number) => void
    setLimit: (limit: number) => void
    createLocation: (locationData: Omit<Location, '_id' | 'id'>) => Promise<void>
    updateLocation: (id: number, locationData: Omit<Location, '_id' | 'id'>) => Promise<void>
    deleteLocation: (id: string) => Promise<void>
    getLocationById: (id: string) => Promise<void>
}

export const useLocationsStore = create<LocationsState>((set, get) => ({
    locations: [],
    Location: null,
    loading: false,
    error: null,
    loadingCreate: false,
    errorCreate: null,
    loadingUpdate: false,
    errorUpdate: null,
    loadingDelete: false,
    errorDelete: null,
    locationsPagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    },
    locationsOptions: {
        page: 1,
        limit: 10,
        sortBy: undefined,
        sortOrder: undefined,
        name: undefined,
        locationType: undefined,
    },
    fetchLocations: async () => {
        set({ loading: true, error: null })
        try {
            const locationsData = await getLocationsApi()
            set({

                locations: locationsData.items,
                locationsPagination: {
                    total: locationsData.total,
                    page: locationsData.page,
                    limit: locationsData.limit,
                    totalPages: locationsData.totalPages,
                }
            })
        }
        catch (error) {
            set({ error: 'Failed to fetch locations', loading: false })
        }
        finally {
            set({ loading: false })
        }
    },
    setPage: (page: number) => {
        set((state) => ({
            locationsOptions: { ...state.locationsOptions, page }
        }))
        void get().fetchLocations()
    },
    setLimit: (limit: number) => {
        set((state) => ({
            locationsOptions: { ...state.locationsOptions, limit }
        }))
        void get().fetchLocations()
    },
    createLocation: async (locationData) => {
        set({ loadingCreate: true, errorCreate: null })
        try {
            await createLocationApi(locationData)
        }
        catch (error) {
            set({ errorCreate: 'Failed to create location', loadingCreate: false })
            throw error
        }
        finally {
            set({ loadingCreate: false })
        }
    },
    updateLocation: async (id, locationData) => {
        set({ loadingUpdate: true, errorUpdate: null })
        try {
            await updateLocationApi(id.toString(), locationData)
        }
        catch (error) {
            set({ errorUpdate: 'Failed to update location', loadingUpdate: false })
            throw error
        }
        finally {
            set({ loadingUpdate: false })
        }
    },
    deleteLocation: async (id) => {
        set({ loadingDelete: true, errorDelete: null })
        try {
            await deleteLocationApi(id.toString())
            await get().fetchLocations()
        }
        catch (error) {
            set({ errorDelete: 'Failed to delete location', loadingDelete: false })
            throw error
        }
        finally {
            set({ loadingDelete: false })
        }
    },
    getLocationById: async (id) => {
        set({ loading: true, error: null })
        try {
            const location = await getLocationByIdApi(id.toString())
            set({ Location: location, error: null })
        }
        catch (error) {
            set({ error: 'Failed to fetch location details' })
            throw error
        } finally {
            set({ loading: false })
        }
    }
}))