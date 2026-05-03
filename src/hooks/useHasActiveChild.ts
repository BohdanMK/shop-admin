import { useLocation } from 'react-router-dom'
import type { NavItem } from '@/dto/types/navigations.dto'

export function useHasActiveChild(items: NavItem[]): boolean {
    const location = useLocation()
    return items.some((item) => {
        if (item.to && location.pathname.startsWith(item.to)) {
            return true
        }
        if (item.children) {
            return useHasActiveChild(item.children)
        }
        return false
    })
}