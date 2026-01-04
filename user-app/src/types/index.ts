export interface Shop {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    categories: string[];
    distance: string;
    address: string;
    timing: string;
    isOpen: boolean;
    closingSoon?: boolean;
    freeDelivery: boolean;
    deliveryFee?: number;
    deliveryTime: string;
    image: string;
}

export interface Product {
    id: string;
    shopId: string;
    name: string;
    description?: string;
    weight: string;
    pieces?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    category: string;
    tags: string[];
    isAvailable: boolean;
    serves?: number;
    rating?: number;
    reviewCount?: number;
    features?: string[];
    source?: string;
    image: string;
}

export interface Addon {
    id: string;
    name: string;
    price: number;
    image: string;
}

export interface CartItem {
    id: string;
    product: Product;
    quantity: number;
    shopId: string;
    shopName: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
}

export interface DeliveryAddress {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
}

export type RootStackParamList = {
    Welcome: undefined;
    Home: undefined;
    ShopDetails: { shopId: string };
    ProductDetails: { productId: string };
    Cart: undefined;
    Checkout: undefined;
    OrderConfirmation: { orderId: string };
    OrderDetails: { orderId: string };
};

export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled';

export interface PaymentInfo {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    method?: string;
    status: 'pending' | 'success' | 'failed';
}

export interface Order {
    id: string;
    orderId?: string;
    items: CartItem[];
    status: OrderStatus;
    deliveryAddress: DeliveryAddress;
    itemTotal: number;
    deliveryFee: number;
    taxes: number;
    grandTotal: number;
    paymentInfo: PaymentInfo;
    createdAt: Date;
    updatedAt: Date;
    estimatedDelivery?: string;
}
