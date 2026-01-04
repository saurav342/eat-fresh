'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    prefix?: string;
}

export default function StatsCard({
    title,
    value,
    change,
    icon: Icon,
    iconColor = 'text-primary',
    iconBg = 'bg-primary-muted',
    prefix = '',
}: StatsCardProps) {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;

    return (
        <div
            className="card p-6 animate-fadeIn group cursor-default"
            style={{
                background: 'linear-gradient(135deg, var(--card) 0%, rgba(248, 250, 252, 0.8) 100%)',
            }}
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className={`relative w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center transition-all duration-500 group-hover:scale-110`}
                    style={{
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <Icon
                        className={`${iconColor} transition-transform duration-500 group-hover:scale-110`}
                        size={26}
                    />
                    {/* Floating animation on hover */}
                    <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%)',
                        }}
                    />
                </div>
                {change !== undefined && (
                    <div
                        className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl transition-all duration-300 group-hover:scale-105 ${isPositive
                            ? 'bg-success-light text-green-700'
                            : isNegative
                                ? 'bg-error-light text-red-700'
                                : 'bg-border-light text-muted'
                            }`}
                        style={{
                            boxShadow: isPositive
                                ? '0 2px 8px rgba(34, 197, 94, 0.2)'
                                : isNegative
                                    ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                                    : undefined,
                        }}
                    >
                        {isPositive ? (
                            <TrendingUp size={14} className="animate-bounce-subtle" />
                        ) : isNegative ? (
                            <TrendingDown size={14} />
                        ) : null}
                        <span>{isPositive ? '+' : ''}{change}%</span>
                    </div>
                )}
            </div>
            <p className="text-muted text-sm font-medium mb-2 tracking-wide uppercase">{title}</p>
            <p className="text-3xl font-bold text-card-foreground tracking-tight">
                {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>

            {/* Decorative bottom gradient line on hover */}
            <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                style={{
                    background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
                }}
            />
        </div>
    );
}

