
import type { ReactNode } from 'react'
import { createContext, useContext, useState, useMemo, useEffect } from 'react'

interface ColorModeContextType {
    toggleColorMode: () => void
    mode: 'light' | 'dark'
}

export const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => {},
    mode: 'light',
})

const STORAGE_KEY = 'color-mode'

function getSavedMode(): 'light' | 'dark' {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'dark' ? 'dark' : 'light'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>(getSavedMode)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode)
    }, [mode])

    const value = useMemo(() => ({
        toggleColorMode: () => setMode(prev => prev === 'light' ? 'dark' : 'light'),
        mode,
    }), [mode])

    return (
        <ColorModeContext.Provider value={value}>
            {children}
        </ColorModeContext.Provider>
    )
}

export const useColorMode = () => useContext(ColorModeContext)
