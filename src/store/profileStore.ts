// store/profileStore.ts
import { create } from 'zustand'
import { getProfileApi } from '@/api/profile'

interface Profile {
    _id: number
    userName: string
    email: string
    role: string
}


interface ProfileState {
    profile: Profile | null
    isLoading: boolean
    error: string | null
    fetchProfile: () => Promise<void>
    resetProfile: () => void
}


export const useProfileStore = create<ProfileState>((set) => ({

    profile: null,
    isLoading: false,
    error: null,
    fetchProfile: async () => {
        set({ isLoading: true, error: null })

        try {
            const profileData = await getProfileApi()
            set({ profile: profileData })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile'
            set({ error: errorMessage })
            console.error('Failed to fetch profile:', error)
        } finally {
            set({ isLoading: false })
        }
    },
    resetProfile: () => set({ profile: null, error: null }),
}))