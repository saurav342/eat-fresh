'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { adminAPI } from '@/lib/api';
import { DeliveryPartner, Order } from '@/lib/types';
import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    Bike,
    IndianRupee,
    Star,
    MapPin,
    FileText,
    CreditCard,
    CheckCircle,
    XCircle,
    TrendingUp,
    Clock,
    Package,
    Loader2,
} from 'lucide-react';

export default function PartnerDetailPage() {
    const params = useParams();
    const partnerId = params.id as string;
    const [partner, setPartner] = useState<DeliveryPartner | null>(null);
    const [partnerOrders, setPartnerOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPartnerData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [partnersRes, ordersRes] = await Promise.all([
                adminAPI.getPartners({ search: partnerId }),
                adminAPI.getOrders({}),
            ]);
            const foundPartner = partnersRes.partners?.find((p: DeliveryPartner) => p.id === partnerId || p._id === partnerId);
            if (foundPartner) setPartner(foundPartner);
            if (ordersRes.orders) {
                const filteredOrders = ordersRes.orders.filter((o: Order) => o.deliveryPartnerId === partnerId);
                setPartnerOrders(filteredOrders);
            }
        } catch (error) {
            console.error('Error fetching partner data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [partnerId]);

    useEffect(() => {
        fetchPartnerData();
    }, [fetchPartnerData]);

    if (isLoading) {
        return (
            <DashboardLayout title="Loading..." subtitle="">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!partner) {
        return (
            <DashboardLayout title="Partner Not Found" subtitle="">
                <div className="text-center py-20">
                    <p className="text-muted text-lg">Partner with ID {partnerId} not found.</p>
                    <Link href="/partners" className="btn btn-primary mt-4">
                        Back to Partners
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={partner.name} subtitle="Delivery Partner Details">
            {/* Back Button */}
            <Link
                href="/partners"
                className="inline-flex items-center gap-2 text-muted hover:text-card-foreground mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Partners
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="space-y-6">
                    {/* Main Profile */}
                    <div className="card p-6">
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-2xl bg-primary-muted overflow-hidden mx-auto">
                                    {partner.avatar ? (
                                        <img
                                            src={partner.avatar}
                                            alt={partner.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary font-bold text-4xl">
                                            {partner.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <span
                                    className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-3 border-card ${partner.status === 'online'
                                        ? 'bg-success'
                                        : partner.status === 'busy'
                                            ? 'bg-warning'
                                            : 'bg-muted'
                                        }`}
                                />
                            </div>
                            <h2 className="text-xl font-bold text-card-foreground mt-4">{partner.name}</h2>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <StatusBadge status={partner.status} />
                                {partner.documentsVerified && (
                                    <span className="flex items-center gap-1 text-xs text-success font-medium bg-success-light px-2 py-1 rounded-full">
                                        <CheckCircle size={12} />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-warning-light mb-6">
                            <Star size={20} className="text-warning fill-warning" />
                            <span className="text-2xl font-bold text-amber-700">{partner.rating}</span>
                            <span className="text-muted text-sm">({partner.ratingCount} reviews)</span>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-9 h-9 rounded-lg bg-info-light flex items-center justify-center">
                                    <Mail size={16} className="text-info" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-muted text-xs">Email</p>
                                    <p className="font-medium text-card-foreground truncate">{partner.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-9 h-9 rounded-lg bg-success-light flex items-center justify-center">
                                    <Phone size={16} className="text-success" />
                                </div>
                                <div>
                                    <p className="text-muted text-xs">Phone</p>
                                    <p className="font-medium text-card-foreground">{partner.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-9 h-9 rounded-lg bg-primary-muted flex items-center justify-center">
                                    <Calendar size={16} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-muted text-xs">Joined</p>
                                    <p className="font-medium text-card-foreground">
                                        {new Date(partner.joinedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="card p-6">
                        <h3 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                            <Bike size={18} className="text-primary" />
                            Vehicle Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted">Type</span>
                                <span className="font-medium text-card-foreground capitalize">
                                    {partner.vehicleType}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted">Number</span>
                                <span className="font-medium text-card-foreground">{partner.vehicleNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bank Details */}
                    {partner.bankDetails && (
                        <div className="card p-6">
                            <h3 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
                                <CreditCard size={18} className="text-info" />
                                Bank Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted">Bank</span>
                                    <span className="font-medium text-card-foreground">
                                        {partner.bankDetails.bankName}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">Account</span>
                                    <span className="font-medium text-card-foreground">
                                        {partner.bankDetails.accountNumber}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">IFSC</span>
                                    <span className="font-medium text-card-foreground">
                                        {partner.bankDetails.ifscCode}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted">Holder</span>
                                    <span className="font-medium text-card-foreground">
                                        {partner.bankDetails.accountHolderName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats and Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Earnings Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="card p-5 bg-gradient-to-br from-primary to-primary-dark text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock size={18} />
                                <span className="text-sm font-medium opacity-90">Today</span>
                            </div>
                            <p className="text-3xl font-bold">₹{partner.todayEarnings || 0}</p>
                            <p className="text-sm opacity-75 mt-1">{partner.todayDeliveries || 0} deliveries</p>
                        </div>
                        <div className="card p-5">
                            <div className="flex items-center gap-2 mb-3 text-muted">
                                <TrendingUp size={18} />
                                <span className="text-sm font-medium">This Week</span>
                            </div>
                            <p className="text-3xl font-bold text-card-foreground">
                                ₹{(partner.weeklyEarnings || 0).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="card p-5">
                            <div className="flex items-center gap-2 mb-3 text-muted">
                                <Calendar size={18} />
                                <span className="text-sm font-medium">This Month</span>
                            </div>
                            <p className="text-3xl font-bold text-card-foreground">
                                ₹{(partner.monthlyEarnings || 0).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="card p-5">
                            <div className="flex items-center gap-2 mb-3 text-muted">
                                <IndianRupee size={18} />
                                <span className="text-sm font-medium">All Time</span>
                            </div>
                            <p className="text-3xl font-bold text-success">
                                ₹{((partner.totalEarnings || 0) / 1000).toFixed(1)}K
                            </p>
                        </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="card p-6">
                        <h3 className="font-bold text-card-foreground mb-4">Performance Metrics</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center p-4 rounded-xl bg-border-light">
                                <Package size={24} className="mx-auto text-primary mb-2" />
                                <p className="text-3xl font-bold text-card-foreground">
                                    {partner.totalDeliveries}
                                </p>
                                <p className="text-sm text-muted">Total Deliveries</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-border-light">
                                <Star size={24} className="mx-auto text-warning fill-warning mb-2" />
                                <p className="text-3xl font-bold text-card-foreground">{partner.rating}</p>
                                <p className="text-sm text-muted">Average Rating</p>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-border-light">
                                <IndianRupee size={24} className="mx-auto text-success mb-2" />
                                <p className="text-3xl font-bold text-card-foreground">
                                    ₹{partner.totalDeliveries > 0 ? ((partner.totalEarnings || 0) / partner.totalDeliveries).toFixed(0) : 0}
                                </p>
                                <p className="text-sm text-muted">Avg Per Delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    {partner.documents && partner.documents.length > 0 && (
                        <div className="card overflow-hidden">
                            <div className="p-4 border-b border-border">
                                <h3 className="font-bold text-card-foreground flex items-center gap-2">
                                    <FileText size={18} className="text-info" />
                                    Document Verification
                                </h3>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {partner.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className={`flex items-center gap-3 p-4 rounded-xl ${doc.verified ? 'bg-success-light' : 'bg-warning-light'
                                                }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.verified ? 'bg-success' : 'bg-warning'
                                                    }`}
                                            >
                                                {doc.verified ? (
                                                    <CheckCircle size={20} className="text-white" />
                                                ) : (
                                                    <XCircle size={20} className="text-white" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-card-foreground">{doc.name}</p>
                                                <p className="text-xs text-muted">
                                                    Uploaded{' '}
                                                    {new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${doc.verified
                                                    ? 'bg-white text-success'
                                                    : 'bg-white text-warning'
                                                    }`}
                                            >
                                                {doc.verified ? 'Verified' : 'Pending'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recent Deliveries */}
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-card-foreground">Recent Deliveries</h3>
                            <span className="text-sm text-muted">{partnerOrders.length} orders</span>
                        </div>
                        {partnerOrders.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Shop</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partnerOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="font-semibold text-primary hover:underline"
                                                >
                                                    #{order.id.slice(-6)}
                                                </Link>
                                            </td>
                                            <td>
                                                <p className="font-medium">{order.userName}</p>
                                                <p className="text-xs text-muted">{order.userPhone}</p>
                                            </td>
                                            <td className="text-muted">{order.shopName}</td>
                                            <td className="font-semibold">
                                                ₹{order.grandTotal.toLocaleString('en-IN')}
                                            </td>
                                            <td>
                                                <StatusBadge status={order.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-muted">No deliveries found</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
