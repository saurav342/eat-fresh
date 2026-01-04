interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'dot';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; glow?: string; animate?: boolean }> = {
    // Order statuses
    pending: { bg: 'bg-warning-light', text: 'text-amber-700', dot: 'bg-warning', glow: 'rgba(245, 158, 11, 0.4)', animate: true },
    confirmed: { bg: 'bg-info-light', text: 'text-blue-700', dot: 'bg-info', glow: 'rgba(59, 130, 246, 0.4)' },
    preparing: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', glow: 'rgba(139, 92, 246, 0.4)', animate: true },
    out_for_delivery: { bg: 'bg-primary-muted', text: 'text-orange-700', dot: 'bg-primary', glow: 'rgba(249, 115, 22, 0.4)', animate: true },
    delivered: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success', glow: 'rgba(34, 197, 94, 0.4)' },
    cancelled: { bg: 'bg-error-light', text: 'text-red-700', dot: 'bg-error' },

    // User/Partner statuses
    active: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success', glow: 'rgba(34, 197, 94, 0.4)' },
    inactive: { bg: 'bg-border-light', text: 'text-muted', dot: 'bg-muted' },
    blocked: { bg: 'bg-error-light', text: 'text-red-700', dot: 'bg-error' },
    online: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success', glow: 'rgba(34, 197, 94, 0.4)', animate: true },
    offline: { bg: 'bg-border-light', text: 'text-muted', dot: 'bg-muted' },
    busy: { bg: 'bg-warning-light', text: 'text-amber-700', dot: 'bg-warning', glow: 'rgba(245, 158, 11, 0.4)', animate: true },

    // Payment statuses
    success: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success', glow: 'rgba(34, 197, 94, 0.4)' },
    failed: { bg: 'bg-error-light', text: 'text-red-700', dot: 'bg-error' },

    // Document statuses
    verified: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success', glow: 'rgba(34, 197, 94, 0.4)' },
    unverified: { bg: 'bg-warning-light', text: 'text-amber-700', dot: 'bg-warning', glow: 'rgba(245, 158, 11, 0.4)', animate: true },
};

const formatStatus = (status: string): string => {
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
    const config = statusConfig[status.toLowerCase()] || {
        bg: 'bg-border-light',
        text: 'text-muted',
        dot: 'bg-muted',
    };

    if (variant === 'dot') {
        return (
            <div className="flex items-center gap-2.5">
                <span
                    className={`relative w-2 h-2 rounded-full ${config.dot}`}
                    style={{
                        boxShadow: config.glow ? `0 0 8px ${config.glow}` : undefined,
                    }}
                >
                    {config.animate && (
                        <span
                            className={`absolute inset-0 rounded-full ${config.dot} animate-ping`}
                            style={{ animationDuration: '2s' }}
                        />
                    )}
                </span>
                <span className={`text-sm font-medium ${config.text}`}>
                    {formatStatus(status)}
                </span>
            </div>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} transition-all duration-200 hover:scale-105`}
            style={{
                boxShadow: config.glow ? `0 2px 8px ${config.glow}` : undefined,
            }}
        >
            <span
                className={`relative w-1.5 h-1.5 rounded-full ${config.dot}`}
            >
                {config.animate && (
                    <span
                        className={`absolute inset-0 rounded-full ${config.dot} animate-ping`}
                        style={{ animationDuration: '2s', opacity: 0.75 }}
                    />
                )}
            </span>
            {formatStatus(status)}
        </span>
    );
}

