import { useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { AppRouter } from '@/router'
import { ColorModeProvider, useColorMode } from '@/context/ColorModeContext'

function ThemedApp() {
  const { mode } = useColorMode()
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  )
}

function App() {
  return (
    <ColorModeProvider>
      <ThemedApp />
    </ColorModeProvider>
  )
}

export default App
