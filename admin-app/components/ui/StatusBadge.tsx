interface StatusBadgeProps {
    status: string;
    variant?: 'default' | 'dot';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    // Order statuses
    pending: { bg: 'bg-warning-light', text: 'text-amber-700', dot: 'bg-warning' },
    confirmed: { bg: 'bg-info-light', text: 'text-blue-700', dot: 'bg-info' },
    preparing: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
    out_for_delivery: { bg: 'bg-primary-muted', text: 'text-orange-700', dot: 'bg-primary' },
    delivered: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success' },
    cancelled: { bg: 'bg-error-light', text: 'text-red-700', dot: 'bg-error' },

    // User/Partner statuses
    active: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success' },
    inactive: { bg: 'bg-border-light', text: 'text-muted', dot: 'bg-muted' },
    blocked: { bg: 'bg-error-light', text: 'text-red-700', dot: 'bg-error' },
    online: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success' },
    offline: { bg: 'bg-border-light', text: 'text-muted', dot: 'bg-muted' },
    busy: { bg: 'bg-warning-light', text: 'text-amber-700', dot: 'bg-warning' },

    // Payment statuses
    success: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success' },
    failed: { bg: 'bg-error-light', text: 'text-red-700', dot: 'bg-error' },

    // Document statuses
    verified: { bg: 'bg-success-light', text: 'text-green-700', dot: 'bg-success' },
    unverified: { bg: 'bg-warning-light', text: 'text-amber-700', dot: 'bg-warning' },
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
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                <span className={`text-sm font-medium ${config.text}`}>
                    {formatStatus(status)}
                </span>
            </div>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {formatStatus(status)}
        </span>
    );
}
