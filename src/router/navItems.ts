import type { NavItem } from '@/dto/types/navigations.dto'
import type { TFunction } from 'i18next'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import SettingsIcon from '@mui/icons-material/Settings';

export const getNavItems = (t: TFunction): NavItem[] => [
    { label: t('nav:dashboard'), icon: HomeIcon, to: '/', match: 'exact' },
    {
        label: t('nav:categories'),
        icon: CategoryIcon,
        children: [
            { label: t('nav:allCategories'), to: '/categories', match: 'prefix' },
        ],
    },
    {
        label: t('nav:markets'),
        icon: LocalGroceryStoreIcon,
        children: [
            { label: t('nav:products'), to: '/products', match: 'prefix' },
            { label: t('nav:orders'), to: '/orders', match: 'prefix' },
        ],
    },
    {
        label: t('nav:users'), icon: PersonIcon, to: '/users', match: 'prefix'
    },
    {
        label: t('nav:locations'), icon: LocationPinIcon, to: '/locations', match: 'prefix'
    },
    {
        label: t('nav:companySettings'), icon: SettingsIcon, to: '/company-settings', match: 'prefix'
    },
]
