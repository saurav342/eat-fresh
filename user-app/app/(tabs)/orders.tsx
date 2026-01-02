import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, borderRadius, shadows, spacing } from '../../src/theme';
import { useOrder } from '../../src/context/OrderContext';
import { Order } from '../../src/types';

const OrderCard = ({ order, onPress }: { order: Order; onPress: () => void }) => {
    const shopNames = [...new Set(order.items.map(item => item.shopName))].join(', ');
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = () => {
        switch (order.status) {
            case 'delivered':
                return colors.success;
            case 'cancelled':
                return colors.error;
            case 'out_for_delivery':
            case 'preparing':
            case 'confirmed':
                return colors.primary;
            default:
                return colors.warning;
        }
    };

    return (
        <TouchableOpacity style={styles.orderCard} onPress={onPress}>
            <View style={styles.orderCardHeader}>
                <View style={styles.orderIdContainer}>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}15` }]}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                    <Text style={[styles.statusText, { color: getStatusColor() }]}>
                        {order.status.replace(/_/g, ' ')}
                    </Text>
                </View>
            </View>

            <View style={styles.orderCardBody}>
                <View style={styles.shopInfo}>
                    <MaterialIcons name="storefront" size={18} color={colors.primary} />
                    <Text style={styles.shopName} numberOfLines={1}>{shopNames}</Text>
                </View>
                <Text style={styles.itemCount}>{itemCount} item{itemCount > 1 ? 's' : ''}</Text>
            </View>

            <View style={styles.orderCardFooter}>
                <Text style={styles.totalAmount}>₹{order.grandTotal}</Text>
                <View style={styles.viewDetails}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function Orders() {
    const router = useRouter();
    const { orders } = useOrder();

    const activeOrders = orders.filter(
        o => !['delivered', 'cancelled'].includes(o.status)
    );
    const pastOrders = orders.filter(
        o => ['delivered', 'cancelled'].includes(o.status)
    );

    const handleOrderPress = (orderId: string) => {
        router.push({
            pathname: '/order/[id]',
            params: { id: orderId },
        });
    };

    if (orders.length === 0) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={styles.header}>
                    <Text style={styles.headerTitle}>My Orders</Text>
                </SafeAreaView>
                <View style={styles.emptyContent}>
                    <MaterialIcons name="receipt-long" size={80} color={colors.borderLight} />
                    <Text style={styles.emptyTitle}>No orders yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Your order history will appear here
                    </Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => router.push('/(tabs)/home')}
                    >
                        <Text style={styles.browseButtonText}>Start Shopping</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <SafeAreaView style={styles.header}>
                <Text style={styles.headerTitle}>My Orders</Text>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {activeOrders.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.activeDot} />
                            <Text style={styles.sectionTitle}>Active Orders</Text>
                        </View>
                        {activeOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onPress={() => handleOrderPress(order.id)}
                            />
                        ))}
                    </View>
                )}

                {pastOrders.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Past Orders</Text>
                        {pastOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onPress={() => handleOrderPress(order.id)}
                            />
                        ))}
                    </View>
                )}
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
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    emptyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing[8],
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: spacing[4],
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing[2],
        marginBottom: spacing[6],
        textAlign: 'center',
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
        borderRadius: borderRadius.lg,
        ...shadows.md,
        shadowColor: colors.primary,
    },
    browseButtonText: {
        fontSize: 16,
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
    section: {
        marginBottom: spacing[6],
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: spacing[3],
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    orderCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[4],
        marginBottom: spacing[3],
        ...shadows.sm,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[3],
    },
    orderIdContainer: {},
    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.3,
    },
    orderDate: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.full,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    orderCardBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing[2],
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        flex: 1,
    },
    shopName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        flex: 1,
    },
    itemCount: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    orderCardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing[3],
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    viewDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewDetailsText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
});
