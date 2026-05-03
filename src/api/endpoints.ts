


export const API_ENDPOINTS = {
    auth: {
        login: '/api/auth/login',
    },
    dashboard: {
        stats: '/api/dashboard/admin/stats',
    },
    profile: {
        me: '/api/profile',
    },
    categories : {
        list: '/api/categories/admin',
        create: '/api/categories/admin/create',
        createSubCategory: (categoryId: string) => `/api/categories/admin/${categoryId}/subcategories/create`,
        updateSubCategory: (categoryId: string, subCategoryId: string) => `/api/categories/admin/${categoryId}/subcategories/${subCategoryId}/update`,
        deleteSubCategory: (categoryId: string, subCategoryId: string) => `/api/categories/admin/${categoryId}/subcategories/${subCategoryId}/delete`,
        updateCategory: (categoryId: string) => `/api/categories/admin/${categoryId}/update`,
        categoryById: (categoryId: string) => `/api/categories/admin/${categoryId}`,
        subCategories: (categoryId: string) => `/api/categories/${categoryId}/subcategories`,
        delete: (categoryId: string) => `/api/categories/admin/${categoryId}/delete`,
    },
    products: {
        list: '/api/products/admin',
        create: '/api/products/admin/create',
        update: (productId: string) => `/api/products/admin/${productId}/update`,
        delete: (productId: string) => `/api/products/admin/${productId}/delete`,
        productById: (productId: string) => `/api/products/admin/${productId}`,
        createProductOptionGroup: (productId: string) => `/api/products/admin/${productId}/optionGroups/create`,
        updateProductOptionGroupApi: (productId: string, optionId: string) => `/api/products/admin/${productId}/optionGroups/${optionId}/update`,
        deleteProductOptionGroupApi: (productId: string, optionId: string) => `/api/products/admin/${productId}/optionGroups/${optionId}/delete`,
    },
    productsOptions: {
        list: '/api/product-options/admin',
        create: '/api/product-options/admin/create',
        update: (optionId: string) => `/api/product-options/admin/${optionId}/update`,
        delete: (optionId: string) => `/api/product-options/admin/${optionId}/delete`,
        optionById: (optionId: string) => `/api/product-options/admin/${optionId}`,
    },
    orders: {
        list: '/api/order/admin/all',
        orderById: (orderId: string) => `/api/order/admin/${orderId}`,
        updateStatus: (orderId: string) => `/api/order/admin/${orderId}/status`,
    },
    user: {
        list: '/api/users/admin',
        create: '/api/users/admin/create',
        update: (userId: string) => `/api/users/admin/${userId}/update`,
        delete: (userId: string) => `/api/users/admin/${userId}/delete`,
        userById: (userId: string) => `/api/users/admin/${userId}`,
    },
    locations: {
        list: '/api/locations/admin',
        create: '/api/locations/admin/create',
        update: (locationId: string) => `/api/locations/admin/${locationId}/update`,
        delete: (locationId: string) => `/api/locations/admin/${locationId}/delete`,
        locationById: (locationId: string) => `/api/locations/admin/${locationId}`,
    },
    companyInfo: {
        get: '/api/company-info',
        update: '/api/company-info/admin/update',
    },
    uploads: {
        upload: '/api/uploads',
    },
} as const
