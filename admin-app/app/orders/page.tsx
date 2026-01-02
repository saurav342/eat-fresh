'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchInput from '@/components/ui/SearchInput';
import { mockOrders } from '@/lib/mockData';
import { OrderStatus } from '@/lib/types';
import { useState } from 'react';
import Link from 'next/link';
import { Filter, Download, RefreshCw, Eye } from 'lucide-react';

const statusTabs: { label: string; value: OrderStatus | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Preparing', value: 'preparing' },
    { label: 'Out for Delivery', value: 'out_for_delivery' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all');

    const filteredOrders = mockOrders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shopName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = activeTab === 'all' || order.status === activeTab;
        return matchesSearch && matchesStatus;
    });

    const getStatusCount = (status: OrderStatus | 'all') => {
        if (status === 'all') return mockOrders.length;
        return mockOrders.filter((o) => o.status === status).length;
    };

    return (
        <DashboardLayout title="Orders" subtitle={`${mockOrders.length} total orders`}>
            {/* Status Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setActiveTab(tab.value)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeTab === tab.value
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-card text-muted hover:bg-border-light'
                            }`}
                    >
                        {tab.label}
                        <span
                            className={`ml-2 px-2 py-0.5 rounded-md text-xs ${activeTab === tab.value
                                    ? 'bg-white/20'
                                    : 'bg-border-light'
                                }`}
                        >
                            {getStatusCount(tab.value)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by order ID, customer, or shop..."
                    className="w-96"
                />
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary">
                        <Filter size={18} />
                        Filters
                    </button>
                    <button className="btn btn-secondary">
                        <Download size={18} />
                        Export
                    </button>
                    <button className="btn btn-secondary">
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Shop</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Delivery Partner</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
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
                                    <Link
                                        href={`/users/${order.userId}`}
                                        className="hover:text-primary transition-colors"
                                    >
                                        <p className="font-medium">{order.userName}</p>
                                        <p className="text-xs text-muted">{order.userPhone}</p>
                                    </Link>
                                </td>
                                <td className="text-muted">{order.shopName}</td>
                                <td>
                                    <span className="text-sm font-medium">{order.items.length} items</span>
                                </td>
                                <td>
                                    <span className="font-semibold">
                                        ₹{order.grandTotal.toLocaleString('en-IN')}
                                    </span>
                                </td>
                                <td>
                                    {order.deliveryPartnerName ? (
                                        <Link
                                            href={`/partners/${order.deliveryPartnerId}`}
                                            className="text-sm hover:text-primary transition-colors"
                                        >
                                            {order.deliveryPartnerName}
                                        </Link>
                                    ) : (
                                        <span className="text-sm text-muted">Not assigned</span>
                                    )}
                                </td>
                                <td>
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="text-muted text-sm">
                                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td>
                                    <Link
                                        href={`/orders/${order.id}`}
                                        className="btn btn-ghost p-2"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-muted">
                        No orders found matching your criteria.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
