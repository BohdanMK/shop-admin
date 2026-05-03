import { create } from 'zustand'
import { uploadFileApi } from '@/api/uploads'

export interface Upload {
    fileId: string
    fileName: string
    filePath: string
    fileUrl: string
    mimeType?: string
    size?: number | string
    status?: string
    userId?: string
    message?: string
}

interface UploadsState {
    uploads: Upload[]
    isLoading: boolean
    error: string | null
    uploadFile: (file: File) => Promise<Upload>
}

export const useUploadsStore = create<UploadsState>((set) => ({
    uploads: [],
    isLoading: false,
    error: null,
    uploadFile: async (file: File) => {
        set({ isLoading: true, error: null })
        try {
            const uploadData = await uploadFileApi(file)
            set((state) => ({ uploads: [...state.uploads, uploadData] }))
            return uploadData
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload file'
            set({ error: errorMessage })
            console.error('Failed to upload file:', error)
            throw error
        }
        finally {
            set({ isLoading: false })
        }
    },
}))