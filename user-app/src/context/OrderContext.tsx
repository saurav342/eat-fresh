import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Order, CartItem, DeliveryAddress, OrderStatus, PaymentInfo } from '../types';
import { orderAPI, CreateOrderData } from '../services/api';
import { useAuth } from './AuthContext';

interface OrderContextType {
    orders: Order[];
    currentOrder: Order | null;
    isLoading: boolean;
    createOrder: (
        items: CartItem[],
        address: DeliveryAddress,
        shopId: string,
        shopName: string,
        deliveryFee?: number
    ) => Promise<Order>;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    updatePaymentInfo: (orderId: string, paymentInfo: PaymentInfo) => Promise<void>;
    getOrderById: (orderId: string) => Order | undefined;
    fetchOrders: () => Promise<void>;
    clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    // Fetch orders when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await orderAPI.getAll();
            setOrders(response.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createOrder = useCallback(
        async (
            items: CartItem[],
            address: DeliveryAddress,
            shopId: string,
            shopName: string,
            deliveryFee: number = 0
        ): Promise<Order> => {
            const orderData: CreateOrderData = {
                items: items.map((item) => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.image,
                })),
                deliveryAddress: {
                    label: address.label,
                    address: address.address,
                    isDefault: address.isDefault,
                },
                shopId,
                shopName,
                deliveryFee,
            };

            const response = await orderAPI.create(orderData);
            const newOrder = response.order;
            setCurrentOrder(newOrder);
            setOrders((prev) => [newOrder, ...prev]);
            return newOrder;
        },
        []
    );

    const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId || order.orderId === orderId
                    ? { ...order, status, updatedAt: new Date() }
                    : order
            )
        );
        setCurrentOrder((prev) =>
            prev?.id === orderId || prev?.orderId === orderId
                ? { ...prev, status, updatedAt: new Date() }
                : prev
        );
    }, []);

    const updatePaymentInfo = useCallback(
        async (orderId: string, paymentInfo: PaymentInfo) => {
            if (paymentInfo.razorpay_order_id && paymentInfo.razorpay_payment_id && paymentInfo.razorpay_signature) {
                // Verify payment with backend
                const response = await orderAPI.verifyPayment(
                    paymentInfo.razorpay_order_id,
                    paymentInfo.razorpay_payment_id,
                    paymentInfo.razorpay_signature,
                    orderId
                );

                const updatedOrder = response.order;
                setOrders((prev) =>
                    prev.map((order) =>
                        order.orderId === orderId ? updatedOrder : order
                    )
                );
                setCurrentOrder((prev) =>
                    prev?.orderId === orderId ? updatedOrder : prev
                );
            }
        },
        []
    );

    const getOrderById = useCallback(
        (orderId: string) => {
            return (
                orders.find((order) => order.id === orderId || order.orderId === orderId) ||
                (currentOrder?.id === orderId || currentOrder?.orderId === orderId
                    ? currentOrder
                    : undefined)
            );
        },
        [orders, currentOrder]
    );

    const clearCurrentOrder = useCallback(() => {
        setCurrentOrder(null);
    }, []);

    return (
        <OrderContext.Provider
            value={{
                orders,
                currentOrder,
                isLoading,
                createOrder,
                updateOrderStatus,
                updatePaymentInfo,
                getOrderById,
                fetchOrders,
                clearCurrentOrder,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

export default OrderContext;
