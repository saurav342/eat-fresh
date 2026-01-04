import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your local IP for physical devices, localhost for simulators
const API_BASE_URL = 'http://localhost:5000/api';

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

export const getAuthToken = () => authToken;

// Initialize token from storage
export const initializeAuth = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            authToken = token;
        }
    } catch (error) {
        console.error('Error loading auth token:', error);
    }
};

// API request helper
const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
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
    register: async (name: string, email: string, phone: string, password: string) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, password }),
        });
    },

    login: async (phone: string, password: string) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ phone, password }),
        });
    },

    sendOtp: async (phone: string) => {
        return apiRequest('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ phone }),
        });
    },

    verifyOtp: async (phone: string, otp: string) => {
        return apiRequest('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ phone, otp }),
        });
    },

    getMe: async () => {
        return apiRequest('/auth/me');
    },
};

// ============ SHOPS ============

export const shopAPI = {
    getAll: async (params?: { isOpen?: boolean; freeDelivery?: boolean; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.isOpen) queryParams.append('isOpen', 'true');
        if (params?.freeDelivery) queryParams.append('freeDelivery', 'true');
        if (params?.search) queryParams.append('search', params.search);

        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return apiRequest(`/shops${query}`);
    },

    getById: async (id: string) => {
        return apiRequest(`/shops/${id}`);
    },

    getProducts: async (shopId: string, category?: string) => {
        const query = category ? `?category=${category}` : '';
        return apiRequest(`/shops/${shopId}/products${query}`);
    },
};

// ============ PRODUCTS ============

export const productAPI = {
    getAll: async (params?: { category?: string; search?: string; shopId?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append('category', params.category);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.shopId) queryParams.append('shopId', params.shopId);

        const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
        return apiRequest(`/products${query}`);
    },

    getById: async (id: string) => {
        return apiRequest(`/products/${id}`);
    },

    getByCategory: async (category: string) => {
        return apiRequest(`/products/category/${category}`);
    },
};

// ============ CATEGORIES ============

export const categoryAPI = {
    getAll: async () => {
        return apiRequest('/categories');
    },
};

// ============ ORDERS ============

export interface CreateOrderData {
    items: Array<{
        productId: string;
        productName: string;
        quantity: number;
        price: number;
        image?: string;
    }>;
    deliveryAddress: {
        label: string;
        address: string;
        isDefault?: boolean;
    };
    shopId: string;
    shopName: string;
    deliveryFee?: number;
}

export const orderAPI = {
    create: async (orderData: CreateOrderData) => {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        });
    },

    getAll: async (status?: string) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/orders${query}`);
    },

    getById: async (id: string) => {
        return apiRequest(`/orders/${id}`);
    },

    track: async (orderId: string) => {
        return apiRequest(`/orders/track/${orderId}`);
    },

    cancel: async (id: string) => {
        return apiRequest(`/orders/${id}/cancel`, { method: 'PUT' });
    },

    createRazorpayOrder: async (amount: number, orderId: string) => {
        return apiRequest('/orders/create-razorpay', {
            method: 'POST',
            body: JSON.stringify({ amount, orderId }),
        });
    },

    verifyPayment: async (
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        orderId: string
    ) => {
        return apiRequest('/orders/verify-payment', {
            method: 'POST',
            body: JSON.stringify({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                orderId,
            }),
        });
    },
};

// ============ USER ============

export const userAPI = {
    getProfile: async () => {
        return apiRequest('/users/profile');
    },

    updateProfile: async (data: { name?: string; email?: string; avatar?: string }) => {
        return apiRequest('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    addAddress: async (address: { label: string; address: string; isDefault?: boolean }) => {
        return apiRequest('/users/addresses', {
            method: 'POST',
            body: JSON.stringify(address),
        });
    },

    updateAddress: async (id: string, address: { label?: string; address?: string; isDefault?: boolean }) => {
        return apiRequest(`/users/addresses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(address),
        });
    },

    deleteAddress: async (id: string) => {
        return apiRequest(`/users/addresses/${id}`, { method: 'DELETE' });
    },
};

export default {
    auth: authAPI,
    shops: shopAPI,
    products: productAPI,
    categories: categoryAPI,
    orders: orderAPI,
    user: userAPI,
    setAuthToken,
    getAuthToken,
    initializeAuth,
};
