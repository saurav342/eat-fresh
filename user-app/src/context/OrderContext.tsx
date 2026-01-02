import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Order, CartItem, DeliveryAddress, OrderStatus, PaymentInfo } from '../types';

interface OrderContextType {
    orders: Order[];
    currentOrder: Order | null;
    createOrder: (
        items: CartItem[],
        address: DeliveryAddress,
        itemTotal: number,
        deliveryFee: number,
        taxes: number
    ) => Order;
    updateOrderStatus: (orderId: string, status: OrderStatus) => void;
    updatePaymentInfo: (orderId: string, paymentInfo: PaymentInfo) => void;
    getOrderById: (orderId: string) => Order | undefined;
    clearCurrentOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const generateOrderId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EF${timestamp}${random}`;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    const createOrder = useCallback(
        (
            items: CartItem[],
            address: DeliveryAddress,
            itemTotal: number,
            deliveryFee: number,
            taxes: number
        ): Order => {
            const newOrder: Order = {
                id: generateOrderId(),
                items,
                status: 'pending',
                deliveryAddress: address,
                itemTotal,
                deliveryFee,
                taxes,
                grandTotal: itemTotal + deliveryFee + taxes,
                paymentInfo: { status: 'pending' },
                createdAt: new Date(),
                updatedAt: new Date(),
                estimatedDelivery: '45 mins',
            };
            setCurrentOrder(newOrder);
            return newOrder;
        },
        []
    );

    const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId
                    ? { ...order, status, updatedAt: new Date() }
                    : order
            )
        );
        setCurrentOrder((prev) =>
            prev?.id === orderId ? { ...prev, status, updatedAt: new Date() } : prev
        );
    }, []);

    const updatePaymentInfo = useCallback((orderId: string, paymentInfo: PaymentInfo) => {
        const updateFn = (order: Order): Order =>
            order.id === orderId
                ? {
                    ...order,
                    paymentInfo,
                    status: paymentInfo.status === 'success' ? 'confirmed' : order.status,
                    updatedAt: new Date(),
                }
                : order;

        setOrders((prev) => {
            const exists = prev.some((o) => o.id === orderId);
            if (!exists && currentOrder?.id === orderId) {
                return [...prev, updateFn(currentOrder)];
            }
            return prev.map(updateFn);
        });

        setCurrentOrder((prev) => (prev?.id === orderId ? updateFn(prev) : prev));
    }, [currentOrder]);

    const getOrderById = useCallback(
        (orderId: string) => {
            return orders.find((order) => order.id === orderId) ||
                (currentOrder?.id === orderId ? currentOrder : undefined);
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
                createOrder,
                updateOrderStatus,
                updatePaymentInfo,
                getOrderById,
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
