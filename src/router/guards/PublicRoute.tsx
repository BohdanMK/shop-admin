import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const token = useAuthStore((state) => state.token)
    return token ? <Navigate to="/" replace /> : <>{children}</>
}