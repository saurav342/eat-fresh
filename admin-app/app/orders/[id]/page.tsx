'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { getOrderById } from '@/lib/mockData';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    MapPin,
    Phone,
    User,
    Store,
    Truck,
    CreditCard,
    Clock,
    Package,
    CheckCircle,
    XCircle,
    ChefHat,
    Bike,
} from 'lucide-react';

const statusTimeline = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
    { status: 'preparing', label: 'Preparing', icon: ChefHat },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const getTimelineStatus = (currentStatus: string, checkStatus: string) => {
    const statusOrder = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const checkIndex = statusOrder.indexOf(checkStatus);

    if (currentStatus === 'cancelled') return 'cancelled';
    if (checkIndex < currentIndex) return 'completed';
    if (checkIndex === currentIndex) return 'current';
    return 'pending';
};

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;
    const order = getOrderById(orderId);

    if (!order) {
        return (
            <DashboardLayout title="Order Not Found" subtitle="">
                <div className="text-center py-20">
                    <p className="text-muted text-lg">Order with ID {orderId} not found.</p>
                    <Link href="/orders" className="btn btn-primary mt-4">
                        Back to Orders
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout
            title={`Order #${order.id.slice(-6)}`}
            subtitle={`Placed on ${new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}`}
        >
            {/* Back Button */}
            <Link
                href="/orders"
                className="inline-flex items-center gap-2 text-muted hover:text-card-foreground mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Orders
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Timeline */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-card-foreground">Order Status</h3>
                            <StatusBadge status={order.status} />
                        </div>

                        {order.status === 'cancelled' ? (
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-error-light">
                                <div className="w-12 h-12 rounded-full bg-error flex items-center justify-center">
                                    <XCircle size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-error">Order Cancelled</p>
                                    <p className="text-sm text-muted">
                                        This order was cancelled on{' '}
                                        {new Date(order.updatedAt).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                {statusTimeline.map((step, index) => {
                                    const status = getTimelineStatus(order.status, step.status);
                                    const Icon = step.icon;
                                    return (
                                        <div key={step.status} className="flex-1 relative">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${status === 'completed'
                                                            ? 'bg-success text-white'
                                                            : status === 'current'
                                                                ? 'bg-primary text-white animate-pulse'
                                                                : 'bg-border-light text-muted'
                                                        }`}
                                                >
                                                    <Icon size={20} />
                                                </div>
                                                <p
                                                    className={`text-xs font-medium mt-2 text-center ${status === 'pending' ? 'text-muted' : 'text-card-foreground'
                                                        }`}
                                                >
                                                    {step.label}
                                                </p>
                                            </div>
                                            {index < statusTimeline.length - 1 && (
                                                <div
                                                    className={`absolute top-6 left-1/2 w-full h-0.5 ${status === 'completed' ? 'bg-success' : 'bg-border-light'
                                                        }`}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-border">
                            <h3 className="font-bold text-card-foreground">Order Items</h3>
                        </div>
                        <div className="divide-y divide-border-light">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4">
                                    <div className="w-16 h-16 rounded-xl bg-border-light overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.productName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-card-foreground">{item.productName}</p>
                                        <p className="text-sm text-muted">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-card-foreground">
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-border-light space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Item Total</span>
                                <span className="font-medium">₹{order.itemTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Delivery Fee</span>
                                <span className="font-medium">
                                    {order.deliveryFee === 0 ? (
                                        <span className="text-success">FREE</span>
                                    ) : (
                                        `₹${order.deliveryFee}`
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted">Taxes</span>
                                <span className="font-medium">₹{order.taxes}</span>
                            </div>
                            <div className="flex justify-between text-lg pt-2 border-t border-border">
                                <span className="font-bold">Grand Total</span>
                                <span className="font-bold text-primary">
                                    ₹{order.grandTotal.toLocaleString('en-IN')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="card p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center">
                                <MapPin size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-card-foreground mb-1">Delivery Address</h3>
                                <p className="text-sm font-medium text-muted">{order.deliveryAddress.label}</p>
                                <p className="text-muted mt-1">{order.deliveryAddress.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="card p-6">
                        <h3 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                            <User size={18} className="text-info" />
                            Customer Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted">Name</p>
                                <Link
                                    href={`/users/${order.userId}`}
                                    className="font-semibold text-card-foreground hover:text-primary transition-colors"
                                >
                                    {order.userName}
                                </Link>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-muted" />
                                <span className="text-sm">{order.userPhone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shop Info */}
                    <div className="card p-6">
                        <h3 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                            <Store size={18} className="text-primary" />
                            Shop Details
                        </h3>
                        <p className="font-semibold text-card-foreground">{order.shopName}</p>
                    </div>

                    {/* Delivery Partner */}
                    {order.deliveryPartnerId && (
                        <div className="card p-6">
                            <h3 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                                <Truck size={18} className="text-success" />
                                Delivery Partner
                            </h3>
                            <Link
                                href={`/partners/${order.deliveryPartnerId}`}
                                className="flex items-center gap-3 p-3 rounded-xl bg-border-light hover:bg-success-light transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center text-success font-bold">
                                    {order.deliveryPartnerName?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-card-foreground">
                                        {order.deliveryPartnerName}
                                    </p>
                                    <p className="text-xs text-muted">View profile →</p>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Payment Info */}
                    <div className="card p-6">
                        <h3 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                            <CreditCard size={18} className="text-purple-600" />
                            Payment Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted text-sm">Status</span>
                                <StatusBadge status={order.paymentInfo.status} />
                            </div>
                            {order.paymentInfo.method && (
                                <div className="flex justify-between">
                                    <span className="text-muted text-sm">Method</span>
                                    <span className="font-medium text-card-foreground">
                                        {order.paymentInfo.method}
                                    </span>
                                </div>
                            )}
                            {order.paymentInfo.razorpay_payment_id && (
                                <div className="mt-3 p-3 rounded-lg bg-border-light">
                                    <p className="text-xs text-muted mb-1">Payment ID</p>
                                    <p className="text-sm font-mono text-card-foreground">
                                        {order.paymentInfo.razorpay_payment_id}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="card p-6">
                        <h3 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-muted" />
                            Timeline
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted">Created</span>
                                <span className="font-medium">
                                    {new Date(order.createdAt).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Last Updated</span>
                                <span className="font-medium">
                                    {new Date(order.updatedAt).toLocaleString('en-IN')}
                                </span>
                            </div>
                            {order.estimatedDelivery && (
                                <div className="flex justify-between">
                                    <span className="text-muted">Est. Delivery</span>
                                    <span className="font-medium text-primary">{order.estimatedDelivery}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="card p-6 space-y-3">
                            <button className="w-full btn btn-primary">Update Status</button>
                            <button className="w-full btn bg-error-light text-error hover:bg-error hover:text-white transition-colors">
                                Cancel Order
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
