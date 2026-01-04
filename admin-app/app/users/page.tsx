'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import SearchInput from '@/components/ui/SearchInput';
import { adminAPI } from '@/lib/api';
import { User } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Filter, Download, UserPlus, Mail, Phone, MapPin, ArrowUpDown, Loader2, RefreshCw } from 'lucide-react';

type SortField = 'name' | 'totalOrders' | 'totalSpent' | 'joinedAt';
type SortOrder = 'asc' | 'desc';

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<SortField>('joinedAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await adminAPI.getUsers({
                status: statusFilter !== 'all' ? statusFilter : undefined,
                search: searchQuery || undefined,
            });
            if (response.users) setUsers(response.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [statusFilter, searchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users
        .filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.phone.includes(searchQuery);
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'totalOrders':
                    comparison = a.totalOrders - b.totalOrders;
                    break;
                case 'totalSpent':
                    comparison = a.totalSpent - b.totalSpent;
                    break;
                case 'joinedAt':
                    comparison = new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
                    break;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === 'active').length,
        inactive: users.filter((u) => u.status === 'inactive').length,
        blocked: users.filter((u) => u.status === 'blocked').length,
    };

    return (
        <DashboardLayout title="Users" subtitle={`${stats.total} registered users`}>
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'all' ? 'ring-2 ring-primary' : ''
                        }`}
                >
                    <p className="text-sm text-muted font-medium">All Users</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
                </button>
                <button
                    onClick={() => setStatusFilter('active')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'active' ? 'ring-2 ring-success' : ''
                        }`}
                >
                    <p className="text-sm text-muted font-medium">Active</p>
                    <p className="text-2xl font-bold text-success">{stats.active}</p>
                </button>
                <button
                    onClick={() => setStatusFilter('inactive')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'inactive' ? 'ring-2 ring-muted' : ''
                        }`}
                >
                    <p className="text-sm text-muted font-medium">Inactive</p>
                    <p className="text-2xl font-bold text-muted">{stats.inactive}</p>
                </button>
                <button
                    onClick={() => setStatusFilter('blocked')}
                    className={`card p-4 text-left transition-all ${statusFilter === 'blocked' ? 'ring-2 ring-error' : ''
                        }`}
                >
                    <p className="text-sm text-muted font-medium">Blocked</p>
                    <p className="text-2xl font-bold text-error">{stats.blocked}</p>
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by name, email, or phone..."
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
                        Add User
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Contact</th>
                            <th>
                                <button
                                    onClick={() => handleSort('totalOrders')}
                                    className="flex items-center gap-1 hover:text-card-foreground transition-colors"
                                >
                                    Orders
                                    <ArrowUpDown size={14} />
                                </button>
                            </th>
                            <th>
                                <button
                                    onClick={() => handleSort('totalSpent')}
                                    className="flex items-center gap-1 hover:text-card-foreground transition-colors"
                                >
                                    Total Spent
                                    <ArrowUpDown size={14} />
                                </button>
                            </th>
                            <th>
                                <button
                                    onClick={() => handleSort('joinedAt')}
                                    className="flex items-center gap-1 hover:text-card-foreground transition-colors"
                                >
                                    Joined
                                    <ArrowUpDown size={14} />
                                </button>
                            </th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <Link
                                        href={`/users/${user.id}`}
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-primary-muted overflow-hidden flex-shrink-0">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-card-foreground">{user.name}</p>
                                            <p className="text-xs text-muted">{user.email}</p>
                                        </div>
                                    </Link>
                                </td>
                                <td>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5 text-sm text-muted">
                                            <Mail size={14} />
                                            {user.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm text-muted">
                                            <Phone size={14} />
                                            {user.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="font-semibold">{user.totalOrders}</td>
                                <td className="font-semibold text-success">
                                    ₹{user.totalSpent.toLocaleString('en-IN')}
                                </td>
                                <td className="text-muted">
                                    {new Date(user.joinedAt).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td>
                                    <StatusBadge status={user.status} />
                                </td>
                                <td>
                                    <Link
                                        href={`/users/${user.id}`}
                                        className="text-primary font-medium text-sm hover:underline"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
