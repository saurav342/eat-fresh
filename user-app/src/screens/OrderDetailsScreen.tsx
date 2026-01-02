import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { useOrder } from '../context/OrderContext';
import { OrderStatus } from '../types';

const statusSteps: { status: OrderStatus; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { status: 'confirmed', label: 'Order Confirmed', icon: 'check-circle' },
    { status: 'preparing', label: 'Preparing', icon: 'restaurant' },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: 'delivery-dining' },
    { status: 'delivered', label: 'Delivered', icon: 'where-to-vote' },
];

const getStatusIndex = (status: OrderStatus): number => {
    const map: Record<OrderStatus, number> = {
        pending: -1,
        confirmed: 0,
        preparing: 1,
        out_for_delivery: 2,
        delivered: 3,
        cancelled: -2,
    };
    return map[status] ?? -1;
};

export default function OrderDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getOrderById } = useOrder();

    const order = id ? getOrderById(id) : null;
    const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

    if (!order) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order Details</Text>
                    <View style={{ width: 48 }} />
                </SafeAreaView>
                <View style={styles.emptyContent}>
                    <MaterialIcons name="receipt-long" size={80} color={colors.borderLight} />
                    <Text style={styles.emptyTitle}>Order not found</Text>
                    <TouchableOpacity
                        style={styles.backHomeButton}
                        onPress={() => router.replace('/(tabs)/home')}
                    >
                        <Text style={styles.backHomeText}>Go Home</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const groupedItems = order.items.reduce((acc, item) => {
        if (!acc[item.shopId]) {
            acc[item.shopId] = {
                shopName: item.shopName,
                items: [],
            };
        }
        acc[item.shopId].items.push(item);
        return acc;
    }, {} as Record<string, { shopName: string; items: typeof order.items }>);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{ width: 48 }} />
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Order ID Card */}
                <View style={styles.orderIdCard}>
                    <View>
                        <Text style={styles.orderIdLabel}>Order ID</Text>
                        <Text style={styles.orderIdValue}>{order.id}</Text>
                    </View>
                    <View style={[
                        styles.statusBadge,
                        order.status === 'cancelled' && styles.statusBadgeCancelled,
                        order.status === 'delivered' && styles.statusBadgeDelivered,
                    ]}>
                        <Text style={[
                            styles.statusBadgeText,
                            order.status === 'cancelled' && styles.statusBadgeTextCancelled,
                        ]}>
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Order Timeline */}
                {order.status !== 'cancelled' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Status</Text>
                        <View style={styles.timeline}>
                            {statusSteps.map((step, index) => {
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;

                                return (
                                    <View key={step.status} style={styles.timelineItem}>
                                        <View style={styles.timelineLeft}>
                                            <View style={[
                                                styles.timelineIcon,
                                                isCompleted && styles.timelineIconCompleted,
                                                isCurrent && styles.timelineIconCurrent,
                                            ]}>
                                                <MaterialIcons
                                                    name={step.icon}
                                                    size={20}
                                                    color={isCompleted ? colors.white : colors.textSecondary}
                                                />
                                            </View>
                                            {index < statusSteps.length - 1 && (
                                                <View style={[
                                                    styles.timelineLine,
                                                    isCompleted && styles.timelineLineCompleted,
                                                ]} />
                                            )}
                                        </View>
                                        <View style={styles.timelineContent}>
                                            <Text style={[
                                                styles.timelineLabel,
                                                isCompleted && styles.timelineLabelCompleted,
                                            ]}>
                                                {step.label}
                                            </Text>
                                            {isCurrent && (
                                                <Text style={styles.timelineStatus}>In Progress</Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <MaterialIcons name="location-on" size={24} color={colors.primary} />
                        <View style={styles.addressInfo}>
                            <Text style={styles.addressLabel}>
                                {order.deliveryAddress.label}
                            </Text>
                            <Text style={styles.addressText}>
                                {order.deliveryAddress.address}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Order Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Items ({order.items.reduce((sum, i) => sum + i.quantity, 0)})
                    </Text>
                    {Object.values(groupedItems).map((group, idx) => (
                        <View key={idx} style={styles.shopGroup}>
                            <View style={styles.shopHeader}>
                                <MaterialIcons name="storefront" size={16} color={colors.primary} />
                                <Text style={styles.shopName}>{group.shopName}</Text>
                            </View>
                            {group.items.map((item) => (
                                <View key={item.id} style={styles.itemRow}>
                                    <Image
                                        source={{ uri: item.product.image }}
                                        style={styles.itemImage}
                                    />
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName} numberOfLines={1}>
                                            {item.product.name}
                                        </Text>
                                        <Text style={styles.itemQty}>
                                            {item.quantity} x ₹{item.product.price}
                                        </Text>
                                    </View>
                                    <Text style={styles.itemPrice}>
                                        ₹{item.product.price * item.quantity}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Bill Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    <View style={styles.billCard}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹{order.itemTotal}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <Text style={order.deliveryFee === 0 ? styles.billValueGreen : styles.billValue}>
                                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                            </Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Taxes & Charges</Text>
                            <Text style={styles.billValue}>₹{order.taxes}</Text>
                        </View>
                        <View style={styles.billDivider} />
                        <View style={styles.billRow}>
                            <Text style={styles.billTotal}>Total Paid</Text>
                            <Text style={styles.billTotalValue}>₹{order.grandTotal}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment</Text>
                    <View style={styles.paymentCard}>
                        <MaterialIcons
                            name={order.paymentInfo.method === 'cod' ? 'payments' : 'credit-card'}
                            size={24}
                            color={colors.primary}
                        />
                        <View style={styles.paymentInfo}>
                            <Text style={styles.paymentMethod}>
                                {order.paymentInfo.method === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                            </Text>
                            {order.paymentInfo.razorpay_payment_id && (
                                <Text style={styles.paymentId}>
                                    Payment ID: {order.paymentInfo.razorpay_payment_id}
                                </Text>
                            )}
                        </View>
                        <View style={[
                            styles.paymentStatusBadge,
                            order.paymentInfo.status === 'success' && styles.paymentStatusSuccess,
                        ]}>
                            <Text style={styles.paymentStatusText}>
                                {order.paymentInfo.status === 'success' ? 'PAID' : 'PENDING'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Need Help */}
                <TouchableOpacity style={styles.helpButton}>
                    <MaterialIcons name="support-agent" size={24} color={colors.primary} />
                    <Text style={styles.helpText}>Need help with this order?</Text>
                    <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing[8],
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textSecondary,
        marginTop: spacing[4],
        marginBottom: spacing[6],
    },
    backHomeButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[3],
        borderRadius: borderRadius.lg,
    },
    backHomeText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing[4],
        paddingBottom: spacing[8],
    },
    orderIdCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: spacing[4],
        borderRadius: borderRadius.lg,
        marginBottom: spacing[4],
        ...shadows.sm,
    },
    orderIdLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    orderIdValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    statusBadge: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.DEFAULT,
    },
    statusBadgeCancelled: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    statusBadgeDelivered: {
        backgroundColor: colors.primaryMuted,
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },
    statusBadgeTextCancelled: {
        color: colors.error,
    },
    section: {
        marginBottom: spacing[6],
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing[3],
    },
    timeline: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        ...shadows.sm,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    timelineLeft: {
        alignItems: 'center',
        width: 40,
    },
    timelineIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineIconCompleted: {
        backgroundColor: colors.primary,
    },
    timelineIconCurrent: {
        backgroundColor: colors.primary,
        ...shadows.sm,
        shadowColor: colors.primary,
    },
    timelineLine: {
        width: 2,
        height: 32,
        backgroundColor: colors.borderLight,
    },
    timelineLineCompleted: {
        backgroundColor: colors.primary,
    },
    timelineContent: {
        flex: 1,
        paddingLeft: spacing[3],
        paddingBottom: spacing[4],
    },
    timelineLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    timelineLabelCompleted: {
        color: colors.textPrimary,
    },
    timelineStatus: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
        marginTop: 2,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing[3],
        backgroundColor: colors.white,
        padding: spacing[4],
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    addressInfo: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    shopGroup: {
        marginBottom: spacing[3],
    },
    shopHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: spacing[2],
    },
    shopName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: spacing[3],
        borderRadius: borderRadius.lg,
        marginBottom: spacing[2],
        ...shadows.sm,
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.DEFAULT,
    },
    itemDetails: {
        flex: 1,
        marginLeft: spacing[3],
    },
    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    itemQty: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    billCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        ...shadows.sm,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing[2],
    },
    billLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    billValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    billValueGreen: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.success,
    },
    billDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing[2],
    },
    billTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    billTotalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: colors.white,
        padding: spacing[4],
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentMethod: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    paymentId: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    paymentStatusBadge: {
        backgroundColor: colors.borderLight,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.DEFAULT,
    },
    paymentStatusSuccess: {
        backgroundColor: colors.primaryMuted,
    },
    paymentStatusText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary,
    },
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: colors.white,
        padding: spacing[4],
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    helpText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
});
