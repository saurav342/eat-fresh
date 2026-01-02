import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

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
        <div className="card p-6 animate-fadeIn">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}>
                    <Icon className={iconColor} size={24} />
                </div>
                {change !== undefined && (
                    <span
                        className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${isPositive
                                ? 'bg-success-light text-green-700'
                                : isNegative
                                    ? 'bg-error-light text-red-700'
                                    : 'bg-border-light text-muted'
                            }`}
                    >
                        {isPositive ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <p className="text-muted text-sm font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-card-foreground">
                {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
            </p>
        </div>
    );
}
