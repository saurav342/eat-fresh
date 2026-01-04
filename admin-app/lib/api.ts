const API_BASE_URL = 'http://localhost:5000/api';

// Token management (admin uses localStorage in browser)
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (typeof window !== 'undefined') {
        if (token) {
            localStorage.setItem('adminToken', token);
        } else {
            localStorage.removeItem('adminToken');
        }
    }
};

export const getAuthToken = () => {
    if (!authToken && typeof window !== 'undefined') {
        authToken = localStorage.getItem('adminToken');
    }
    return authToken;
};

// API request helper
const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// ============ AUTH ============

export const authAPI = {
    login: async (email: string, password: string) => {
        // Admin uses email-based login
        const response = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone: email, password }), // Backend uses phone field
        });
        return response;
    },
};

// ============ ADMIN ============

export const adminAPI = {
    getDashboard: async () => {
        return apiRequest('/admin/dashboard');
    },

    getUsers: async (params?: { status?: string; search?: string; page?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());

        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return apiRequest(`/admin/users${query}`);
    },

    updateUserStatus: async (id: string, status: string) => {
        return apiRequest(`/admin/users/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    getPartners: async (params?: { status?: string; verified?: boolean; search?: string; page?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.verified !== undefined) queryParams.append('verified', params.verified.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());

        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return apiRequest(`/admin/partners${query}`);
    },

    verifyPartner: async (id: string, verified: boolean) => {
        return apiRequest(`/admin/partners/${id}/verify`, {
            method: 'PUT',
            body: JSON.stringify({ verified }),
        });
    },

    getOrders: async (params?: { status?: string; search?: string; page?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());

        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return apiRequest(`/admin/orders${query}`);
    },

    updateOrderStatus: async (id: string, status: string) => {
        return apiRequest(`/admin/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    assignDeliveryPartner: async (orderId: string, partnerId: string) => {
        return apiRequest(`/admin/orders/${orderId}/assign`, {
            method: 'PUT',
            body: JSON.stringify({ partnerId }),
        });
    },

    getShops: async () => {
        return apiRequest('/admin/shops');
    },
};

// ============ PUBLIC APIs ============

export const shopAPI = {
    getAll: async () => apiRequest('/shops'),
    getById: async (id: string) => apiRequest(`/shops/${id}`),
};

export const categoryAPI = {
    getAll: async () => apiRequest('/categories'),
};

export const productAPI = {
    getAll: async () => apiRequest('/products'),
};

export default {
    auth: authAPI,
    admin: adminAPI,
    shops: shopAPI,
    categories: categoryAPI,
    products: productAPI,
    setAuthToken,
    getAuthToken,
};
