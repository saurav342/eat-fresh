'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <header className="bg-card border-b border-border px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Title Section */}
                <div>
                    <h1 className="text-2xl font-bold text-card-foreground">{title}</h1>
                    {subtitle && (
                        <p className="text-muted text-sm mt-1">{subtitle}</p>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11 pr-4 w-64 bg-background"
                        />
                    </div>

                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl bg-background hover:bg-border-light transition-colors">
                        <Bell size={20} className="text-muted" />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card" />
                    </button>

                    {/* Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-border">
                        <div className="w-10 h-10 rounded-xl bg-primary-muted overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-card-foreground">Admin User</p>
                            <p className="text-xs text-muted">Super Admin</p>
                        </div>
                        <button className="p-1 hover:bg-border-light rounded-lg transition-colors">
                            <ChevronDown size={16} className="text-muted" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
