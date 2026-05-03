// router/routes.tsx
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AuthLayout from '@/layouts/AuthLayout'
import { PrivateRoute } from './guards/PrivateRoute'
import { PublicRoute } from './guards/PublicRoute'

const Login = lazy(() => import('@/pages/Login'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Categories = lazy(() => import('@/pages/categories/Categories'))
const Category = lazy(() => import('@/pages/categories/Category'))
const Products = lazy(() => import('@/pages/products/Products'))
const ProductOptions = lazy(() => import('@/pages/products/ProductsOptions'))
const ProductPage = lazy(() => import('@/pages/products/Product'))
const CreateProduct = lazy(() => import('@/pages/products/CreateProduct'))
const Orders = lazy(() => import('@/pages/orders/Orders'))
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))
const Locations = lazy(() => import('@/pages/locations/LocationsPage'))
const LocationPage = lazy(() => import('@/pages/locations/LocationPage'))
const CreateLocationPage = lazy(() => import('@/pages/locations/CreateLocationsPage'))
const Settings = lazy(() => import('@/pages/settingsCompany/Settings'))

export const routes: RouteObject[] = [
    {
        element: <PublicRoute><AuthLayout /></PublicRoute>,
        children: [
        { path: '/login', element: <Login /> },
        ],
    },
    {
        element: <PrivateRoute><MainLayout /></PrivateRoute>,
        children: [
            { path: '/', element: <Dashboard /> },
            { path: '/categories', element: <Categories /> },
            { path: '/categories/:id', element: <Category /> },
            { path: '/products', element: <Products /> },
            { path: '/products-options', element: <ProductOptions /> },
            { path: '/products/:id', element: <ProductPage /> },
            { path: '/products/new', element: <CreateProduct /> },
            { path: '/orders', element: <Orders /> },
            { path: '/users', element: <UsersPage /> },
            { path : '/locations', element: <Locations /> },
            { path : '/locations/:id', element: <LocationPage /> },
            { path : '/locations/new', element: <CreateLocationPage /> },
            { path : '/company-settings', element: <Settings /> },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]