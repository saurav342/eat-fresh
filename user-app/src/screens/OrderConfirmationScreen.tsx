import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { useOrder } from '../context/OrderContext';

export default function OrderConfirmationScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const { getOrderById } = useOrder();

    const order = orderId ? getOrderById(orderId) : null;

    const scaleAnim = new Animated.Value(0);
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleTrackOrder = () => {
        if (orderId) {
            router.replace({
                pathname: '/order/[id]',
                params: { id: orderId },
            });
        }
    };

    const handleContinueShopping = () => {
        router.replace('/(tabs)/home');
    };

    const shopNames = order
        ? [...new Set(order.items.map(item => item.shopName))].join(', ')
        : '';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.content}>
                {/* Success Icon */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        { transform: [{ scale: scaleAnim }] }
                    ]}
                >
                    <View style={styles.iconCircle}>
                        <MaterialIcons name="check" size={64} color={colors.white} />
                    </View>
                </Animated.View>

                {/* Success Message */}
                <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>Order Placed!</Text>
                    <Text style={styles.subtitle}>
                        Your order has been placed successfully
                    </Text>
                </Animated.View>

                {/* Order Details Card */}
                <Animated.View style={[styles.orderCard, { opacity: fadeAnim }]}>
                    <View style={styles.orderRow}>
                        <Text style={styles.orderLabel}>Order ID</Text>
                        <Text style={styles.orderId}>{orderId || 'N/A'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.orderRow}>
                        <Text style={styles.orderLabel}>Estimated Delivery</Text>
                        <View style={styles.deliveryBadge}>
                            <MaterialIcons name="schedule" size={16} color={colors.primary} />
                            <Text style={styles.deliveryText}>
                                {order?.estimatedDelivery || '45 mins'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.orderRow}>
                        <Text style={styles.orderLabel}>From</Text>
                        <Text style={styles.orderValue} numberOfLines={1}>
                            {shopNames || 'EatFresh'}
                        </Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.orderRow}>
                        <Text style={styles.orderLabel}>Total Amount</Text>
                        <Text style={styles.totalAmount}>₹{order?.grandTotal || 0}</Text>
                    </View>
                </Animated.View>

                {/* Delivery Info */}
                <Animated.View style={[styles.deliveryCard, { opacity: fadeAnim }]}>
                    <MaterialIcons name="delivery-dining" size={24} color={colors.primary} />
                    <View style={styles.deliveryInfo}>
                        <Text style={styles.deliveryTitle}>Delivering to</Text>
                        <Text style={styles.deliveryAddress} numberOfLines={2}>
                            {order?.deliveryAddress?.address || '123, 4th Cross, Indiranagar'}
                        </Text>
                    </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
                    <TouchableOpacity
                        style={styles.trackButton}
                        onPress={handleTrackOrder}
                    >
                        <MaterialIcons name="local-shipping" size={20} color={colors.white} />
                        <Text style={styles.trackButtonText}>Track Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.continueButton}
                        onPress={handleContinueShopping}
                    >
                        <Text style={styles.continueButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing[6],
    },
    iconContainer: {
        marginBottom: spacing[6],
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: spacing[2],
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    orderCard: {
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        marginBottom: spacing[4],
        ...shadows.md,
    },
    orderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing[2],
    },
    orderLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    orderId: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.5,
    },
    orderValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        maxWidth: '60%',
        textAlign: 'right',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing[1],
    },
    deliveryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.DEFAULT,
    },
    deliveryText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    deliveryCard: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        backgroundColor: colors.primaryMuted,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        marginBottom: spacing[8],
    },
    deliveryInfo: {
        flex: 1,
    },
    deliveryTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.primary,
        marginBottom: 2,
    },
    deliveryAddress: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    buttonContainer: {
        width: '100%',
        gap: spacing[3],
    },
    trackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        height: 56,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        ...shadows.md,
        shadowColor: colors.primary,
    },
    trackButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
    continueButton: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
});
