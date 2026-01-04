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
    Sparkles,
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
            className={`fixed left-0 top-0 h-screen flex flex-col transition-all duration-500 z-50 ${collapsed ? 'w-20' : 'w-64'
                }`}
            style={{
                background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
            }}
        >
            {/* Decorative gradient overlay */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at top left, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
                }}
            />

            {/* Logo */}
            <div className="relative flex items-center gap-3 px-6 py-6 border-b border-white/10">
                <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FDBA74 100%)',
                        boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                    }}
                >
                    <span className="text-white font-bold text-lg">EF</span>
                    <Sparkles
                        size={10}
                        className="absolute top-1 right-1 text-white/80 animate-pulse"
                    />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-white font-bold text-xl tracking-tight">EatFresh</h1>
                        <p className="text-slate-400 text-xs font-medium">Admin Portal</p>
                    </div>
                )}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                style={{
                    background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                    boxShadow: '0 2px 10px rgba(249, 115, 22, 0.4)',
                }}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${active
                                ? 'text-white'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            style={{
                                animationDelay: `${index * 50}ms`,
                            }}
                        >
                            {/* Active background */}
                            {active && (
                                <div
                                    className="absolute inset-0 rounded-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                                        boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)',
                                    }}
                                />
                            )}

                            {/* Hover glow effect */}
                            <div
                                className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${active ? 'hidden' : ''}`}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, transparent 100%)',
                                }}
                            />

                            <Icon size={20} className="relative flex-shrink-0 z-10" />
                            {!collapsed && (
                                <span className="relative font-medium truncate z-10">{item.label}</span>
                            )}
                            {!collapsed && active && (
                                <div className="relative ml-auto w-2 h-2 rounded-full bg-white z-10" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="relative px-3 py-4 border-t border-white/10 space-y-1">
                {bottomItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${active
                                ? 'text-white'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {active && (
                                <div
                                    className="absolute inset-0 rounded-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                                    }}
                                />
                            )}
                            <Icon size={20} className="relative flex-shrink-0 z-10" />
                            {!collapsed && <span className="relative font-medium z-10">{item.label}</span>}
                        </Link>
                    );
                })}
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 group"
                >
                    <LogOut size={20} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}

