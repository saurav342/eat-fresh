import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, setAuthToken, initializeAuth, deliveryAPI } from '../services/api';

interface DeliveryPartner {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    status: 'online' | 'offline' | 'busy';
    documentsVerified: boolean;
    rating?: number;
    totalDeliveries?: number;
    todayEarnings?: number;
    todayDeliveries?: number;
}

interface AuthContextType {
    partner: DeliveryPartner | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (phone: string, password: string) => Promise<void>;
    register: (data: {
        name: string;
        phone: string;
        email: string;
        password: string;
        vehicleType: string;
        vehicleNumber: string;
    }) => Promise<void>;
    logout: () => Promise<void>;
    updateStatus: (status: 'online' | 'offline' | 'busy') => Promise<void>;
    refreshPartner: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [partner, setPartner] = useState<DeliveryPartner | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth on mount
    useEffect(() => {
        const loadAuth = async () => {
            try {
                await initializeAuth();
                const token = await AsyncStorage.getItem('dpAuthToken');
                if (token) {
                    setAuthToken(token);
                    const response = await authAPI.getProfile();
                    setPartner(response.partner);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                await AsyncStorage.removeItem('dpAuthToken');
                setAuthToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuth();
    }, []);

    const login = useCallback(async (phone: string, password: string) => {
        const response = await authAPI.login(phone, password);
        await AsyncStorage.setItem('dpAuthToken', response.token);
        setAuthToken(response.token);
        setPartner(response.partner);
    }, []);

    const register = useCallback(async (data: {
        name: string;
        phone: string;
        email: string;
        password: string;
        vehicleType: string;
        vehicleNumber: string;
    }) => {
        const response = await authAPI.register(data);
        await AsyncStorage.setItem('dpAuthToken', response.token);
        setAuthToken(response.token);
        setPartner(response.partner);
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem('dpAuthToken');
        setAuthToken(null);
        setPartner(null);
    }, []);

    const updateStatus = useCallback(async (status: 'online' | 'offline' | 'busy') => {
        const response = await deliveryAPI.updateStatus(status);
        setPartner(response.partner);
    }, []);

    const refreshPartner = useCallback(async () => {
        try {
            const response = await authAPI.getProfile();
            setPartner(response.partner);
        } catch (error) {
            console.error('Error refreshing partner:', error);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                partner,
                isLoading,
                isAuthenticated: !!partner,
                login,
                register,
                logout,
                updateStatus,
                refreshPartner,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
