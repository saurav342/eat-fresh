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
        const token = await AsyncStorage.getItem('dpAuthToken');
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
    register: async (data: {
        name: string;
        phone: string;
        email: string;
        password: string;
        vehicleType: string;
        vehicleNumber: string;
    }) => {
        return apiRequest('/delivery/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    login: async (phone: string, password: string) => {
        return apiRequest('/delivery/login', {
            method: 'POST',
            body: JSON.stringify({ phone, password }),
        });
    },

    getProfile: async () => {
        return apiRequest('/delivery/profile');
    },
};

// ============ DELIVERY PARTNER ============

export const deliveryAPI = {
    updateStatus: async (status: 'online' | 'offline' | 'busy') => {
        return apiRequest('/delivery/status', {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    updateLocation: async (lat: number, lng: number) => {
        return apiRequest('/delivery/location', {
            method: 'PUT',
            body: JSON.stringify({ lat, lng }),
        });
    },

    getAssignedOrders: async (status?: string) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/delivery/orders${query}`);
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        return apiRequest(`/delivery/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },

    getEarnings: async () => {
        return apiRequest('/delivery/earnings');
    },
};

export default {
    auth: authAPI,
    delivery: deliveryAPI,
    setAuthToken,
    getAuthToken,
    initializeAuth,
};
