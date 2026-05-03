import { Outlet } from 'react-router-dom';

import { Alert, AppBar, Box, CircularProgress, Drawer, IconButton, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useProfileStore } from '@/store/profileStore';
import { useEffect, useMemo } from 'react';
import LogoItem from '@/components/ui/LogoItem';
import LogOutBtn from '@/components/ui/LogOutBtn';
import ProfileShortName from '@/components/ui/ProfileShortName';
import SidebarNav from '@/components/ui/SidebarNav';
import { getNavItems } from '@/router/navItems';
import { useColorMode } from '@/context/ColorModeContext';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240

export default function MainLayout() {
    const { mode, toggleColorMode } = useColorMode()
    const { t, i18n } = useTranslation(['common', 'nav'])
    const profile = useProfileStore((state) => state.profile)
    const isLoading = useProfileStore((state) => state.isLoading)
    const error = useProfileStore((state) => state.error)
    const fetchProfile = useProfileStore((state) => state.fetchProfile)
    const navItems = useMemo(() => getNavItems(t), [t, i18n.resolvedLanguage])

    useEffect(() => {
        if (!profile && !isLoading && !error) {
            void fetchProfile()
        }
    }, [profile, isLoading, error, fetchProfile])




    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                }}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap component="div">
                        {t('common:adminPanel')}
                    </Typography>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                    }}>


                        <Select
                            value={i18n.resolvedLanguage === 'en' ? 'en' : 'uk'}
                            onChange={(event) => {
                                void i18n.changeLanguage(event.target.value)
                            }}
                            variant="outlined"
                            sx={{
                                '& fieldset': { border: 'none' },
                        }}
                            >
                            <MenuItem value="uk">{t('common:ukrainian')}</MenuItem>
                            <MenuItem value="en">{t('common:english')}</MenuItem>
                        </Select>
                        <IconButton onClick={toggleColorMode} size="small">
                            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                        <ProfileShortName />
                        <LogOutBtn />
                    </div>

                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <LogoItem text={t('common:shopAdmin')} />
                {/* <Toolbar /> */}
                <SidebarNav items={navItems} />
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: 3, pt: 10 }}>
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {
                    profile && (
                        <Outlet />
                    )
                }

            </Box>
        </Box>
    );
}