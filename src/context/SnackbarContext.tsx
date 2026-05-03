// src/context/SnackbarContext.tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Snackbar, Alert } from '@mui/material'

type Severity = 'success' | 'error' | 'warning' | 'info'

interface SnackbarOptions {
    message: string
    severity?: Severity
    duration?: number
    dataTestId?: string
}

interface SnackbarContextType {
    showSnackbar: (options: SnackbarOptions) => void
}

const SnackbarContext = createContext<SnackbarContextType | null>(null)

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState('')
    const [severity, setSeverity] = useState<Severity>('info')
    const [duration, setDuration] = useState(3000)
    const [testId, setTestId] = useState<string | undefined>(undefined)

    const showSnackbar = ({ message, severity = 'info', duration = 3000, dataTestId }: SnackbarOptions) => {
        setMessage(message)
        setSeverity(severity)
        setDuration(duration)
        setTestId(dataTestId)
        setOpen(true)
    }

    const handleClose = () => setOpen(false)

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
        {children}
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={handleClose}
                severity={severity}
                variant="filled"
                data-testid={testId ?? 'snackbar-alert'}
                data-severity={severity}
            >
            {message}
            </Alert>
        </Snackbar>
        </SnackbarContext.Provider>
    )
}

export const useSnackbar = () => {
    const context = useContext(SnackbarContext)
    if (!context) throw new Error('useSnackbar must be used within SnackbarProvider')
    return context
}