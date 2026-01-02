'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Truck,
    ShoppingBag,
    Store,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/users', label: 'Users', icon: Users },
    { href: '/partners', label: 'Delivery Partners', icon: Truck },
    { href: '/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/shops', label: 'Shops', icon: Store },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const bottomItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-sidebar-bg flex flex-col transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-hover">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">EF</span>
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-white font-bold text-xl">EatFresh</h1>
                        <p className="text-sidebar-text text-xs">Admin Portal</p>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-colors"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                                }`}
                        >
                            <Icon size={20} className="flex-shrink-0" />
                            {!collapsed && (
                                <span className="font-medium truncate">{item.label}</span>
                            )}
                            {!collapsed && active && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="px-3 py-4 border-t border-sidebar-hover space-y-1">
                {bottomItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                                    ? 'bg-primary text-white'
                                    : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                                }`}
                        >
                            <Icon size={20} className="flex-shrink-0" />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all duration-200"
                >
                    <LogOut size={20} className="flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
