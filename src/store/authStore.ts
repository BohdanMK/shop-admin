// store/authStore.ts
import { create } from 'zustand'
import { loginApi } from '@/api/auth'
import type { Role } from '@/types/role'

interface AuthState {
    token: string | null
    role: Role | null
    setAuth: (token: string, role: Role) => void
    clearAuth: () => void
    login: (email: string, password: string) => Promise<void>
    logOut: () => void
    isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') as Role | null,

    setAuth: (token, role) => {
        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        set({ token, role })
    },

    clearAuth: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        set({ token: null, role: null })
    },

    login: async (email, password) => {
        try {
            const { token, role } = await loginApi({ email, password })
            get().setAuth(token, role)
        } catch (error) {
            console.error('Login failed:', error)
            throw error
        }
    },

    logOut: () => {
        get().clearAuth()
    },

    isAuthenticated: () => !!get().token,
}))