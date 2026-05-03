import type { BreadcrumbItem } from '@/components/ui/BreadcrumbsList'
import type { TFunction } from 'i18next'

export const getCategoriesBreadcrumbs = (t: TFunction): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:categories'),
        type: 'label',
    },
]

export const getCategoryDetailsBreadcrumbs = (t: TFunction): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:categories'),
        path: '/categories',
        type: 'link',
    },
    {
        title: t('breadcrumbs:categoryDetails'),
        type: 'label',
    },
]


export const getProductsBreadcrumbs = (t: TFunction): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:products'),
        type: 'label',
    },
]

export const getProductDetailsBreadcrumbs = (t: TFunction, name?: string): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:products'),
        path: '/products',
        type: 'link',
    },
    {
        title: name ?? t('breadcrumbs:edit'),
        type: 'label'
    },
]

export const getProductOptionsBreadcrumbs = (t: TFunction): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:productOptions'),
        type: 'label',
    },
]

export const getOrdersBreadcrumbs = (t: TFunction): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:orders'),
        type: 'label',
    },
]

export const getUsersBreadcrumbs = (t: TFunction): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:users'),
        type: 'label',
    },
]

export const getLocationsBaseBreadcrumbs = (t: TFunction): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:locations'),
        type: 'label',
    },
]

export const getLocationDetailsBreadcrumbs = (t: TFunction, name?: string): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:locations'),
        path: '/locations',
        type: 'link',
    },
    {
        title: name ?? t('breadcrumbs:createLocation'),
        type: 'label'
    },
]

export const getSettingsBreadcrumbs = (t: TFunction, name?: string): BreadcrumbItem[] => [
    {
        title: t('breadcrumbs:home'),
        path: '/',
        type: 'link',
    },
    {
        title: t('breadcrumbs:companySettings'),
        type: 'label',
    },
    {
        title: name ?? t('breadcrumbs:edit'),
        type: 'label'
    }
]