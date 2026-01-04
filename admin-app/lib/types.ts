// User Types
export interface DeliveryAddress {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
    lat?: number;
    lng?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    addresses: DeliveryAddress[];
    totalOrders: number;
    totalSpent: number;
    joinedAt: Date;
    lastOrderAt?: Date;
    status: 'active' | 'inactive' | 'blocked';
}

// Delivery Partner Types
export interface BankDetails {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
}

export interface Document {
    id: string;
    type: 'aadhar' | 'pan' | 'dl' | 'rc';
    name: string;
    verified: boolean;
    uploadedAt: Date;
}

export interface DeliveryPartner {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    email: string;
    status: 'online' | 'offline' | 'busy';
    vehicleType: 'bike' | 'scooter' | 'car';
    vehicleNumber: string;
    totalDeliveries: number;
    totalEarnings: number;
    rating: number;
    ratingCount: number;
    joinedAt: Date;
    documentsVerified: boolean;
    currentLocation?: { lat: number; lng: number };
    bankDetails: BankDetails;
    documents: Document[];
    todayEarnings: number;
    todayDeliveries: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
}

// Order Types
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
    method?: string;
    status: 'pending' | 'success' | 'failed';
}

export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
}

export interface Order {
    id: string;
    userId: string;
    userName: string;
    userPhone: string;
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
    deliveryPartnerId?: string;
    deliveryPartnerName?: string;
    shopId: string;
    shopName: string;
}

// Shop Types
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
    totalOrders: number;
    totalRevenue: number;
}

// Analytics Types
export interface DashboardStats {
    totalUsers: number;
    totalPartners: number;
    totalOrders: number;
    totalRevenue: number;
    usersGrowth: number;
    partnersGrowth: number;
    ordersGrowth: number;
    revenueGrowth: number;
    // Today's stats
    todayOrders?: number;
    todayDelivered?: number;
    todayCancelled?: number;
    todayRevenue?: number;
    // Order breakdown
    pendingOrders?: number;
    confirmedOrders?: number;
    preparingOrders?: number;
    outForDeliveryOrders?: number;
    deliveredOrders?: number;
    // Top shops
    topShops?: Array<{ name: string; orders: number; revenue: string }>;
}
