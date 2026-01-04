'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchInput from '@/components/ui/SearchInput';

import { adminAPI } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Filter, Download, RefreshCw, Eye, Loader2, Package, ChevronRight } from 'lucide-react';

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Update indicator position
    useEffect(() => {
        const activeIndex = statusTabs.findIndex(tab => tab.value === activeTab);
        const activeTabElement = tabRefs.current[activeIndex];
        if (activeTabElement) {
            setIndicatorStyle({
                left: activeTabElement.offsetLeft,
                width: activeTabElement.offsetWidth,
            });
        }
    }, [activeTab]);

    const fetchOrders = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await adminAPI.getOrders({
                status: activeTab !== 'all' ? activeTab : undefined,
                search: searchQuery || undefined,
            });
            if (response.orders) setOrders(response.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, searchQuery]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shopName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = activeTab === 'all' || order.status === activeTab;
        return matchesSearch && matchesStatus;
    });

    const getStatusCount = (status: OrderStatus | 'all') => {
        if (status === 'all') return orders.length;
        return orders.filter((o) => o.status === status).length;
    };

    return (
        <DashboardLayout title="Orders" subtitle={`${orders.length} total orders`}>
            {/* Premium Status Tabs with Sliding Indicator */}
            <div className="relative mb-8">
                <div
                    className="flex gap-1 p-1.5 rounded-2xl overflow-x-auto"
                    style={{
                        background: 'linear-gradient(135deg, var(--border-light) 0%, rgba(241, 245, 249, 0.6) 100%)',
                    }}
                >
                    {/* Sliding Indicator */}
                    <div
                        className="absolute top-1.5 h-[calc(100%-12px)] rounded-xl transition-all duration-300"
                        style={{
                            left: indicatorStyle.left,
                            width: indicatorStyle.width,
                            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.35)',
                        }}
                    />

                    {statusTabs.map((tab, index) => (
                        <button
                            key={tab.value}
                            ref={el => { tabRefs.current[index] = el; }}
                            onClick={() => setActiveTab(tab.value)}
                            className={`relative z-10 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${activeTab === tab.value
                                ? 'text-white'
                                : 'text-muted hover:text-card-foreground'
                                }`}
                        >
                            {tab.label}
                            <span
                                className={`ml-2 px-2 py-0.5 rounded-lg text-xs font-bold transition-all duration-300 ${activeTab === tab.value
                                    ? 'bg-white/20 text-white'
                                    : 'bg-border text-muted'
                                    }`}
                            >
                                {getStatusCount(tab.value)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by order ID, customer, or shop..."
                    className="w-96"
                />
                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary group">
                        <Filter size={18} className="group-hover:text-primary transition-colors" />
                        Filters
                    </button>
                    <button className="btn btn-secondary group">
                        <Download size={18} className="group-hover:text-primary transition-colors" />
                        Export
                    </button>
                    <button
                        className="btn btn-secondary group"
                        onClick={() => fetchOrders()}
                    >
                        <RefreshCw size={18} className={`group-hover:text-primary transition-colors ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Premium Orders Table */}
            <div
                className="card overflow-hidden"
                style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
                }}
            >
                {isLoading ? (
                    <div className="p-8">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-4 border-b border-border-light last:border-0">
                                <div className="skeleton w-20 h-5" />
                                <div className="skeleton w-32 h-5" />
                                <div className="skeleton w-40 h-5" />
                                <div className="skeleton w-16 h-5" />
                                <div className="skeleton w-20 h-5" />
                                <div className="skeleton w-28 h-5" />
                                <div className="skeleton w-24 h-8 rounded-full" />
                                <div className="skeleton w-28 h-5" />
                                <div className="skeleton w-10 h-10 rounded-xl ml-auto" />
                            </div>
                        ))}
                    </div>
                ) : (
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
                            {filteredOrders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="animate-slide-up"
                                    style={{
                                        animationDelay: `${index * 30}ms`,
                                        animationFillMode: 'both',
                                    }}
                                >
                                    <td>
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="font-bold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1 group"
                                        >
                                            #{order.id.slice(-6)}
                                            <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            href={`/users/${order.userId}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            <p className="font-semibold text-card-foreground">{order.userName}</p>
                                            <p className="text-xs text-muted mt-0.5">{order.userPhone}</p>
                                        </Link>
                                    </td>
                                    <td>
                                        <span className="text-card-foreground font-medium">{order.shopName}</span>
                                    </td>
                                    <td>
                                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-card-foreground">
                                            <Package size={14} className="text-muted" />
                                            {order.items.length} items
                                        </span>
                                    </td>
                                    <td>
                                        <span
                                            className="font-bold text-card-foreground"
                                            style={{ fontVariantNumeric: 'tabular-nums' }}
                                        >
                                            ₹{order.grandTotal.toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td>
                                        {order.deliveryPartnerName ? (
                                            <Link
                                                href={`/partners/${order.deliveryPartnerId}`}
                                                className="text-sm font-medium hover:text-primary transition-colors"
                                            >
                                                {order.deliveryPartnerName}
                                            </Link>
                                        ) : (
                                            <span className="text-sm text-muted italic">Unassigned</span>
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
                                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-border-light hover:bg-primary hover:text-white transition-all duration-200 group"
                                        >
                                            <Eye size={18} className="text-muted group-hover:text-white transition-colors" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!isLoading && filteredOrders.length === 0 && (
                    <div className="empty-state py-16">
                        <div
                            className="empty-state-icon mb-6"
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-muted) 0%, rgba(255, 247, 237, 0.5) 100%)',
                            }}
                        >
                            <Package size={32} className="text-primary" />
                        </div>
                        <h3 className="empty-state-title text-lg">No orders found</h3>
                        <p className="empty-state-description">
                            Try adjusting your search or filter criteria to find what you're looking for.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

