const BASE_URL = 'http://localhost:3001';

// Helper to get headers with current token
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRrefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

// Centralized fetch wrapper with automatic refresh logic
const apiFetch = async (endpoint: string, options: any = {}): Promise<Response> => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const headers = { ...getHeaders(), ...options.headers };

    let response = await fetch(url, { ...options, headers });

    // Handle 401 Unauthorized (Token expired)
    if (response.status === 401 && !url.includes('/auth/refresh') && !url.includes('/auth/login')) {
        if (!isRefreshing) {
            isRefreshing = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Try to refresh the token
                    const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'refresh-token': `Bearer ${refreshToken}`
                        }
                    });

                    if (refreshResponse.ok) {
                        const tokens = await refreshResponse.json();
                        localStorage.setItem('accessToken', tokens.accessToken);
                        localStorage.setItem('refreshToken', tokens.refreshToken);
                        isRefreshing = false;
                        onRrefreshed(tokens.accessToken);
                    } else {
                        throw new Error('Refresh failed');
                    }
                } catch (error) {
                    isRefreshing = false;
                    logout();
                    window.location.href = '/login';
                    throw new Error('Session expired. Please login again.');
                }
            } else {
                logout();
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }
        }

        // Return a promise that waits for the token to be refreshed
        return new Promise<Response>((resolve) => {
            subscribeTokenRefresh((token: string) => {
                resolve(fetch(url, {
                    ...options,
                    headers: { ...headers, 'Authorization': `Bearer ${token}` }
                }));
            });
        });
    }

    return response;
};

export const getProfile = async () => {
    const response = await apiFetch('/users/profile');
    return response.json();
}

export const getProducts = async () => {
    const response = await apiFetch('/products');
    return response.json();
}

export const getProductsByCategory = async (categoryId: string) => {
    const response = await apiFetch(`/products/category/${categoryId}`);
    return response.json();
}

export const createProduct = async (productData: any) => {
    const response = await apiFetch('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    });
    return response.json();
}

export const updateProduct = async (id: string, productData: any) => {
    const response = await apiFetch(`/products/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(productData)
    });
    return response.json();
}

export const deleteProduct = async (id: string) => {
    const response = await apiFetch(`/products/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

export const getMyStores = async () => {
    const response = await apiFetch('/stores/my');
    return response.json();
}

export const getProductsByStore = async (storeId: string) => {
    const response = await apiFetch(`/products/store/${storeId}`);
    return response.json();
}

export const createStore = async (storeData: any) => {
    const response = await apiFetch('/stores', {
        method: 'POST',
        body: JSON.stringify(storeData)
    });
    return response.json();
}

export const getProduct = async (id: string) => {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    return response.json();
}

export const getMasterCategories = async () => {
    const response = await fetch(`${BASE_URL}/master/categories`);
    return response.json();
}


export const login = async (email: string, password: string) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok && data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
}

export const getMyProfile = async () => {
    const response = await apiFetch('/api/users/profile');
    return response.json();
}

export const updateMyProfile = async (userData: any) => {
    const response = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
    return response.json();
}

export const deleteMyAccount = async () => {
    const response = await apiFetch('/api/users/profile', {
        method: 'DELETE'
    });
    return response.json();
}

export const getAddresses = async () => {
    const response = await apiFetch('/api/addresses');
    return response.json();
}

export const getDefaultAddress = async () => {
    const response = await apiFetch('/api/addresses/default');
    return response.json();
}

export const addAddress = async (addressData: { address: string, phone: string }) => {
    const response = await apiFetch('/api/addresses', {
        method: 'POST',
        body: JSON.stringify(addressData)
    });
    return response.json();
}

export const updateAddress = async (id: string, addressData: { address?: string, phone?: string }) => {
    const response = await apiFetch(`/api/addresses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(addressData)
    });
    return response.json();
}

export const deleteAddress = async (id: string) => {
    const response = await apiFetch(`/api/addresses/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

export const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName })
    });
    return response;
}

export const addToCart = async (productId: string, quantity: number, variantId?: string) => {
    const response = await apiFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity, variantId })
    });
    return response.json();
}

export const getCart = async () => {
    const response = await apiFetch('/cart');
    return response.json();
}

export const createOrder = async () => {
    const response = await apiFetch('/orders', {
        method: 'POST'
    });
    return response.json();
}

export const removeFromCart = async (id: string) => {
    const response = await apiFetch(`/cart/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

export const getMyOrders = async () => {
    const response = await apiFetch('/orders/my');
    return response.json();
}

export const getStoreOrders = async () => {
    const response = await apiFetch('/orders/store');
    return response.json();
}

export const updateOrderStatus = async (orderId: string, status: string, trackingCourier?: string, trackingNumber?: string) => {
    const response = await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, trackingCourier, trackingNumber })
    });
    return response.json();
}

// User Management (Admin Only)
export const getAllUsers = async (pageIndex = 1, pageSize = 10, keyword = '') => {
    const response = await apiFetch(`/api/users?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${keyword}`);
    return response.json();
}

export const getUserDetail = async (id: string) => {
    const response = await apiFetch(`/api/users/${id}`);
    return response.json();
}

export const updateUserByAdmin = async (id: string, userData: any) => {
    const response = await apiFetch(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
    return response.json();
}

export const deleteUser = async (id: string) => {
    const response = await apiFetch(`/api/users/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}

export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
}

export const forgotPassword = async (email: string) => {
    const response = await apiFetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    return response.json();
};

export const resetPassword = async (token: string, newPassword: string) => {
    const response = await apiFetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
    });
    return response.json();
};

export const getActionLogStats = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await apiFetch('/api/actionlog/stats', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return response.json();
};

export const getCategories = async (params: any) => {
    const query = new URLSearchParams(params).toString();
    const response = await apiFetch(`/categories?${query}`);
    return response.json();
};

export const createCategory = async (data: any) => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await apiFetch('/categories', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteCategory = async (id: string) => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await apiFetch(`/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return response.json();
};

export const updateCategory = async (id: string, data: any) => {
    const accessToken = localStorage.getItem('accessToken');
    const response = await apiFetch(`/categories/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
};
