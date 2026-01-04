'use client';

import { Bell, Search, ChevronDown, Command } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <header
            className="sticky top-0 z-40 border-b border-border/50"
            style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            }}
        >
            <div className="px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Title Section */}
                    <div className="animate-fadeIn">
                        <h1 className="text-2xl font-bold text-card-foreground tracking-tight">{title}</h1>
                        {subtitle && (
                            <p className="text-muted text-sm mt-0.5">{subtitle}</p>
                        )}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div
                            className={`relative transition-all duration-300 ${searchFocused ? 'w-80' : 'w-64'}`}
                        >
                            <Search
                                size={18}
                                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`}
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                className="input pl-11 pr-12 bg-background/50 hover:bg-background focus:bg-card"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                                <kbd className="px-1.5 py-0.5 rounded bg-border-light font-mono">⌘</kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-border-light font-mono">K</kbd>
                            </div>
                        </div>

                        {/* Notifications */}
                        <button
                            className="relative p-2.5 rounded-xl bg-background/50 hover:bg-border-light transition-all duration-200 group"
                        >
                            <Bell size={20} className="text-muted group-hover:text-card-foreground transition-colors" />
                            <span
                                className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white"
                                style={{
                                    animation: 'glow-pulse 2s ease-in-out infinite',
                                    boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)',
                                }}
                            />
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-3 pl-4 border-l border-border">
                            <div
                                className="relative w-10 h-10 rounded-xl overflow-hidden transition-transform duration-200 hover:scale-105"
                                style={{
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                                }}
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                                    alt="Admin"
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"
                                />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-semibold text-card-foreground">Admin User</p>
                                <p className="text-xs text-muted">Super Admin</p>
                            </div>
                            <button className="p-1.5 hover:bg-border-light rounded-lg transition-all duration-200 group">
                                <ChevronDown size={16} className="text-muted group-hover:text-card-foreground transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

