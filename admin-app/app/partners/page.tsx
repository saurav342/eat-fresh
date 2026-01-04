'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchInput from '@/components/ui/SearchInput';
import { adminAPI } from '@/lib/api';
import { DeliveryPartner } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
    Filter,
    Download,
    UserPlus,
    Star,
    Bike,
    IndianRupee,
    CheckCircle,
    AlertCircle,
    Loader2,
    RefreshCw,
} from 'lucide-react';

export default function PartnersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [partners, setPartners] = useState<DeliveryPartner[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPartners = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await adminAPI.getPartners({
                status: statusFilter !== 'all' ? statusFilter : undefined,
                search: searchQuery || undefined,
            });
            if (response.partners) setPartners(response.partners);
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, searchQuery]);

    useEffect(() => {
        fetchPartners();
    }, [fetchPartners]);

    const filteredPartners = partners.filter((partner) => {
        const matchesSearch =
            partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            partner.phone.includes(searchQuery) ||
            partner.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || partner.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: partners.length,
        online: partners.filter((p) => p.status === 'online').length,
        busy: partners.filter((p) => p.status === 'busy').length,
        offline: partners.filter((p) => p.status === 'offline').length,
        verified: partners.filter((p) => p.documentsVerified).length,
    };

    return (
        <DashboardLayout
            title="Delivery Partners"
            subtitle={`${stats.total} registered partners`}
        >
            {/* Quick Stats */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''
                        }`}
                >
                    <p className="text-sm text-muted font-medium">All Partners</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
                </button>
                <button
                    onClick={() => setStatusFilter('online')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'online' ? 'ring-2 ring-success' : ''
                        }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <p className="text-sm text-muted font-medium">Online</p>
                    </div>
                    <p className="text-2xl font-bold text-success">{stats.online}</p>
                </button>
                <button
                    onClick={() => setStatusFilter('busy')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'busy' ? 'ring-2 ring-warning' : ''
                        }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-warning" />
                        <p className="text-sm text-muted font-medium">Busy</p>
                    </div>
                    <p className="text-2xl font-bold text-warning">{stats.busy}</p>
                </button>
                <button
                    onClick={() => setStatusFilter('offline')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'offline' ? 'ring-2 ring-muted' : ''
                        }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-muted" />
                        <p className="text-sm text-muted font-medium">Offline</p>
                    </div>
                    <p className="text-2xl font-bold text-muted">{stats.offline}</p>
                </button>
                <div className="card p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle size={14} className="text-success" />
                        <p className="text-sm text-muted font-medium">Verified</p>
                    </div>
                    <p className="text-2xl font-bold text-card-foreground">{stats.verified}</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by name, phone, or vehicle number..."
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
                    <button className="btn btn-primary">
                        <UserPlus size={18} />
                        Add Partner
                    </button>
                </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                    <Link
                        key={partner.id}
                        href={`/partners/${partner.id}`}
                        className="card p-5 hover:shadow-lg transition-all group"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-xl bg-primary-muted overflow-hidden">
                                        {partner.avatar ? (
                                            <img
                                                src={partner.avatar}
                                                alt={partner.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                                                {partner.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${partner.status === 'online'
                                            ? 'bg-success'
                                            : partner.status === 'busy'
                                                ? 'bg-warning'
                                                : 'bg-muted'
                                            }`}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-card-foreground group-hover:text-primary transition-colors">
                                        {partner.name}
                                    </h3>
                                    <p className="text-sm text-muted">{partner.phone}</p>
                                </div>
                            </div>
                            <StatusBadge status={partner.status} />
                        </div>

                        {/* Vehicle Info */}
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-border-light mb-4">
                            <Bike size={16} className="text-muted" />
                            <span className="text-sm font-medium text-card-foreground capitalize">
                                {partner.vehicleType}
                            </span>
                            <span className="text-muted">•</span>
                            <span className="text-sm text-muted">{partner.vehicleNumber}</span>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-2 rounded-lg bg-success-light">
                                <p className="text-lg font-bold text-success">
                                    ₹{(partner.totalEarnings / 1000).toFixed(0)}K
                                </p>
                                <p className="text-xs text-muted">Total Earned</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-info-light">
                                <p className="text-lg font-bold text-info">{partner.totalDeliveries}</p>
                                <p className="text-xs text-muted">Deliveries</p>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-warning-light">
                                <div className="flex items-center justify-center gap-1">
                                    <Star size={14} className="text-warning fill-warning" />
                                    <span className="font-bold text-amber-700">{partner.rating}</span>
                                </div>
                                <p className="text-xs text-muted">{partner.ratingCount} reviews</p>
                            </div>
                        </div>

                        {/* Today's Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-border-light">
                            <div>
                                <p className="text-xs text-muted">Today</p>
                                <p className="font-semibold text-success">₹{partner.todayEarnings}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted">Trips</p>
                                <p className="font-semibold text-card-foreground">{partner.todayDeliveries}</p>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {partner.documentsVerified ? (
                                    <span className="flex items-center gap-1 text-xs text-success font-medium">
                                        <CheckCircle size={14} />
                                        Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-warning font-medium">
                                        <AlertCircle size={14} />
                                        Pending
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </DashboardLayout>
    );
}
