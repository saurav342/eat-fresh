'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { getUserById, getOrdersByUserId } from '@/lib/mockData';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShoppingBag,
    IndianRupee,
    Clock,
    Ban,
    MoreVertical,
    Star,
} from 'lucide-react';

export default function UserDetailPage() {
    const params = useParams();
    const userId = params.id as string;
    const user = getUserById(userId);
    const userOrders = getOrdersByUserId(userId);

    if (!user) {
        return (
            <DashboardLayout title="User Not Found" subtitle="">
                <div className="text-center py-20">
                    <p className="text-muted text-lg">User with ID {userId} not found.</p>
                    <Link href="/users" className="btn btn-primary mt-4">
                        Back to Users
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const avgOrderValue = user.totalOrders > 0 ? user.totalSpent / user.totalOrders : 0;

    return (
        <DashboardLayout title={user.name} subtitle="User Details">
            {/* Back Button */}
            <Link
                href="/users"
                className="inline-flex items-center gap-2 text-muted hover:text-card-foreground mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Users
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="card p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-primary-muted overflow-hidden">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-3xl">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-card-foreground">{user.name}</h2>
                                <StatusBadge status={user.status} />
                            </div>
                        </div>
                        <button className="p-2 hover:bg-border-light rounded-lg transition-colors">
                            <MoreVertical size={20} className="text-muted" />
                        </button>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-9 h-9 rounded-lg bg-info-light flex items-center justify-center">
                                <Mail size={16} className="text-info" />
                            </div>
                            <div>
                                <p className="text-muted text-xs">Email</p>
                                <p className="font-medium text-card-foreground">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-9 h-9 rounded-lg bg-success-light flex items-center justify-center">
                                <Phone size={16} className="text-success" />
                            </div>
                            <div>
                                <p className="text-muted text-xs">Phone</p>
                                <p className="font-medium text-card-foreground">{user.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-9 h-9 rounded-lg bg-primary-muted flex items-center justify-center">
                                <Calendar size={16} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-muted text-xs">Member Since</p>
                                <p className="font-medium text-card-foreground">
                                    {new Date(user.joinedAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t border-border">
                        {user.status === 'blocked' ? (
                            <button className="w-full btn btn-secondary">
                                Unblock User
                            </button>
                        ) : (
                            <button className="w-full btn bg-error-light text-error hover:bg-error hover:text-white transition-colors">
                                <Ban size={16} />
                                Block User
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats and Orders */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="card p-4">
                            <div className="w-10 h-10 rounded-xl bg-primary-muted flex items-center justify-center mb-3">
                                <ShoppingBag size={20} className="text-primary" />
                            </div>
                            <p className="text-muted text-sm">Total Orders</p>
                            <p className="text-2xl font-bold text-card-foreground">{user.totalOrders}</p>
                        </div>
                        <div className="card p-4">
                            <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center mb-3">
                                <IndianRupee size={20} className="text-success" />
                            </div>
                            <p className="text-muted text-sm">Total Spent</p>
                            <p className="text-2xl font-bold text-success">
                                ₹{user.totalSpent.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="card p-4">
                            <div className="w-10 h-10 rounded-xl bg-info-light flex items-center justify-center mb-3">
                                <Star size={20} className="text-info" />
                            </div>
                            <p className="text-muted text-sm">Avg Order Value</p>
                            <p className="text-2xl font-bold text-info">
                                ₹{avgOrderValue.toFixed(0)}
                            </p>
                        </div>
                        <div className="card p-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                                <Clock size={20} className="text-purple-600" />
                            </div>
                            <p className="text-muted text-sm">Last Order</p>
                            <p className="text-lg font-bold text-card-foreground">
                                {user.lastOrderAt
                                    ? new Date(user.lastOrderAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                    })
                                    : 'Never'}
                            </p>
                        </div>
                    </div>

                    {/* Saved Addresses */}
                    <div className="card">
                        <div className="p-4 border-b border-border">
                            <h3 className="font-bold text-card-foreground">Saved Addresses</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {user.addresses.length > 0 ? (
                                user.addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`flex items-start gap-3 p-4 rounded-xl ${address.isDefault ? 'bg-primary-muted' : 'bg-border-light'
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center">
                                            <MapPin
                                                size={18}
                                                className={address.isDefault ? 'text-primary' : 'text-muted'}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-card-foreground">{address.label}</p>
                                                {address.isDefault && (
                                                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted mt-1">{address.address}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center py-4">No saved addresses</p>
                            )}
                        </div>
                    </div>

                    {/* Order History */}
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-card-foreground">Order History</h3>
                            <Link
                                href={`/orders?userId=${user.id}`}
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                View All Orders
                            </Link>
                        </div>
                        {userOrders.length > 0 ? (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Shop</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td>
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="font-semibold text-primary hover:underline"
                                                >
                                                    #{order.id.slice(-6)}
                                                </Link>
                                            </td>
                                            <td className="text-muted">{order.shopName}</td>
                                            <td className="font-semibold">
                                                ₹{order.grandTotal.toLocaleString('en-IN')}
                                            </td>
                                            <td>
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="text-muted text-sm">
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-muted">No orders found</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
