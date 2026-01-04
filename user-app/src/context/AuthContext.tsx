import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, setAuthToken, initializeAuth } from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    addresses: Array<{
        id: string;
        label: string;
        address: string;
        isDefault: boolean;
    }>;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (phone: string, password: string) => Promise<void>;
    loginWithOtp: (phone: string, otp: string) => Promise<void>;
    sendOtp: (phone: string) => Promise<{ otp?: string }>;
    register: (name: string, email: string, phone: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth on mount
    useEffect(() => {
        const loadAuth = async () => {
            try {
                await initializeAuth();
                const token = await AsyncStorage.getItem('authToken');
                if (token) {
                    setAuthToken(token);
                    const response = await authAPI.getMe();
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                await AsyncStorage.removeItem('authToken');
                setAuthToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadAuth();
    }, []);

    const login = useCallback(async (phone: string, password: string) => {
        const response = await authAPI.login(phone, password);
        await AsyncStorage.setItem('authToken', response.token);
        setAuthToken(response.token);
        setUser(response.user);
    }, []);

    const loginWithOtp = useCallback(async (phone: string, otp: string) => {
        const response = await authAPI.verifyOtp(phone, otp);
        await AsyncStorage.setItem('authToken', response.token);
        setAuthToken(response.token);
        setUser(response.user);
    }, []);

    const sendOtp = useCallback(async (phone: string) => {
        const response = await authAPI.sendOtp(phone);
        return response;
    }, []);

    const register = useCallback(async (name: string, email: string, phone: string, password: string) => {
        const response = await authAPI.register(name, email, phone, password);
        await AsyncStorage.setItem('authToken', response.token);
        setAuthToken(response.token);
        setUser(response.user);
    }, []);

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        try {
            const response = await authAPI.getMe();
            setUser(response.user);
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                loginWithOtp,
                sendOtp,
                register,
                logout,
                refreshUser,
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
