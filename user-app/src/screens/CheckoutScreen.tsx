import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RazorpayCheckout from 'react-native-razorpay';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { DeliveryAddress } from '../types';

// Replace with your Razorpay Test Key
const RAZORPAY_KEY = 'rzp_test_YOUR_KEY_HERE';

const defaultAddress: DeliveryAddress = {
    id: '1',
    label: 'Home',
    address: '123, 4th Cross, Indiranagar',
    isDefault: true,
};

export default function CheckoutScreen() {
    const router = useRouter();
    const { items, totalAmount, clearCart } = useCart();
    const { createOrder, updatePaymentInfo } = useOrder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<'razorpay' | 'cod'>('razorpay');

    const deliveryFee = 0;
    const taxes = Math.round(totalAmount * 0.05);
    const grandTotal = totalAmount + deliveryFee + taxes;

    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.shopId]) {
            acc[item.shopId] = {
                shopName: item.shopName,
                shopId: item.shopId,
                items: [],
            };
        }
        acc[item.shopId].items.push(item);
        return acc;
    }, {} as Record<string, { shopName: string; shopId: string; items: typeof items }>);

    const handleRazorpayPayment = async () => {
        if (items.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }

        setIsProcessing(true);

        // Create order first
        const order = createOrder(
            items,
            defaultAddress,
            totalAmount,
            deliveryFee,
            taxes
        );

        const options = {
            description: `Order ${order.id} from EatFresh`,
            image: 'https://your-logo-url.com/logo.png',
            currency: 'INR',
            key: RAZORPAY_KEY,
            amount: grandTotal * 100, // Amount in paise
            name: 'EatFresh',
            order_id: '', // Optional: Create order on backend and pass order_id
            prefill: {
                email: 'customer@example.com',
                contact: '9876543210',
                name: 'Customer Name',
            },
            theme: { color: colors.primary },
        };

        try {
            const data = await RazorpayCheckout.open(options);

            // Payment successful
            updatePaymentInfo(order.id, {
                razorpay_payment_id: data.razorpay_payment_id,
                razorpay_order_id: data.razorpay_order_id,
                razorpay_signature: data.razorpay_signature,
                method: 'razorpay',
                status: 'success',
            });

            clearCart();
            router.replace({
                pathname: '/order-confirmation',
                params: { orderId: order.id },
            });
        } catch (error: any) {
            // Payment failed or cancelled
            console.log('Payment error:', error);
            updatePaymentInfo(order.id, {
                status: 'failed',
                method: 'razorpay',
            });

            if (error.code !== 'PAYMENT_CANCELLED') {
                Alert.alert(
                    'Payment Failed',
                    error.description || 'Something went wrong. Please try again.'
                );
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCODPayment = () => {
        if (items.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }

        setIsProcessing(true);

        const order = createOrder(
            items,
            defaultAddress,
            totalAmount,
            deliveryFee,
            taxes
        );

        updatePaymentInfo(order.id, {
            method: 'cod',
            status: 'success',
        });

        clearCart();
        router.replace({
            pathname: '/order-confirmation',
            params: { orderId: order.id },
        });
    };

    const handlePayment = () => {
        if (selectedPayment === 'razorpay') {
            handleRazorpayPayment();
        } else {
            handleCODPayment();
        }
    };

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={styles.emptyHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <View style={{ width: 48 }} />
                </SafeAreaView>
                <View style={styles.emptyContent}>
                    <MaterialIcons name="shopping-cart" size={80} color={colors.borderLight} />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add items to proceed with checkout</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => router.replace('/(tabs)/home')}
                    >
                        <Text style={styles.browseButtonText}>Browse Shops</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                    <View style={{ width: 48 }} />
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Delivery Address */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <View style={styles.addressLeft}>
                            <View style={styles.addressIcon}>
                                <MaterialIcons name="location-on" size={24} color={colors.primary} />
                            </View>
                            <View style={styles.addressInfo}>
                                <Text style={styles.addressLabel}>{defaultAddress.label.toUpperCase()}</Text>
                                <Text style={styles.addressText} numberOfLines={2}>
                                    {defaultAddress.address}
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.changeButton}>
                            <Text style={styles.changeButtonText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Delivery Time */}
                <View style={styles.deliveryBanner}>
                    <MaterialIcons name="schedule" size={20} color={colors.success} />
                    <Text style={styles.deliveryBannerText}>
                        Estimated delivery in <Text style={styles.deliveryBannerBold}>45 mins</Text>
                    </Text>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    {Object.values(groupedItems).map((group) => (
                        <View key={group.shopId} style={styles.shopGroup}>
                            <View style={styles.shopHeader}>
                                <MaterialIcons name="storefront" size={18} color={colors.primary} />
                                <Text style={styles.shopName}>{group.shopName}</Text>
                            </View>
                            {group.items.map((item) => (
                                <View key={item.id} style={styles.orderItem}>
                                    <Image
                                        source={{ uri: item.product.image }}
                                        style={styles.orderItemImage}
                                    />
                                    <View style={styles.orderItemDetails}>
                                        <Text style={styles.orderItemName} numberOfLines={1}>
                                            {item.product.name}
                                        </Text>
                                        <Text style={styles.orderItemQty}>
                                            {item.quantity} x ₹{item.product.price}
                                        </Text>
                                    </View>
                                    <Text style={styles.orderItemPrice}>
                                        ₹{item.product.price * item.quantity}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Method</Text>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            selectedPayment === 'razorpay' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedPayment('razorpay')}
                    >
                        <View style={styles.paymentOptionLeft}>
                            <View style={[
                                styles.radioButton,
                                selectedPayment === 'razorpay' && styles.radioButtonSelected,
                            ]}>
                                {selectedPayment === 'razorpay' && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                            <MaterialIcons name="credit-card" size={24} color={colors.primary} />
                            <View style={styles.paymentOptionInfo}>
                                <Text style={styles.paymentOptionTitle}>Pay Online</Text>
                                <Text style={styles.paymentOptionSubtitle}>
                                    UPI, Cards, Net Banking, Wallets
                                </Text>
                            </View>
                        </View>
                        <Image
                            source={{ uri: 'https://razorpay.com/assets/razorpay-glyph.svg' }}
                            style={styles.razorpayLogo}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            selectedPayment === 'cod' && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedPayment('cod')}
                    >
                        <View style={styles.paymentOptionLeft}>
                            <View style={[
                                styles.radioButton,
                                selectedPayment === 'cod' && styles.radioButtonSelected,
                            ]}>
                                {selectedPayment === 'cod' && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                            <MaterialIcons name="payments" size={24} color={colors.warning} />
                            <View style={styles.paymentOptionInfo}>
                                <Text style={styles.paymentOptionTitle}>Cash on Delivery</Text>
                                <Text style={styles.paymentOptionSubtitle}>
                                    Pay when your order arrives
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Bill Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    <View style={styles.billCard}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹{totalAmount}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <Text style={styles.billValueGreen}>FREE</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Taxes & Charges</Text>
                            <Text style={styles.billValue}>₹{taxes}</Text>
                        </View>
                        <View style={styles.billDivider} />
                        <View style={styles.billRow}>
                            <Text style={styles.billTotalLabel}>To Pay</Text>
                            <Text style={styles.billTotalValue}>₹{grandTotal}</Text>
                        </View>
                    </View>
                </View>

                {/* Security */}
                <View style={styles.securityRow}>
                    <MaterialIcons name="verified-user" size={18} color={colors.textSecondary} />
                    <Text style={styles.securityText}>100% Safe & Secure Payments</Text>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <SafeAreaView style={styles.bottomBar}>
                <View style={styles.bottomContent}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>TOTAL</Text>
                        <Text style={styles.totalValue}>₹{grandTotal}</Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.payButton,
                            isProcessing && styles.payButtonDisabled,
                        ]}
                        onPress={handlePayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <>
                                <Text style={styles.payButtonText}>
                                    {selectedPayment === 'razorpay' ? 'Pay Now' : 'Place Order'}
                                </Text>
                                <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    emptyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
        marginBottom: spacing[2],
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing[6],
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing[8],
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
    header: {
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 150,
    },
    section: {
        marginHorizontal: spacing[4],
        marginTop: spacing[4],
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing[3],
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    addressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: spacing[3],
    },
    addressIcon: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addressInfo: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    changeButton: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.DEFAULT,
    },
    changeButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },
    deliveryBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginHorizontal: spacing[4],
        marginTop: spacing[4],
        padding: spacing[3],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    deliveryBannerText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.success,
    },
    deliveryBannerBold: {
        fontWeight: '700',
    },
    shopGroup: {
        marginBottom: spacing[4],
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
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing[3],
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        marginBottom: spacing[2],
        borderWidth: 1,
        borderColor: colors.border,
    },
    orderItemImage: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.DEFAULT,
    },
    orderItemDetails: {
        flex: 1,
        marginLeft: spacing[3],
    },
    orderItemName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    orderItemQty: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    orderItemPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing[4],
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1.5,
        borderColor: colors.border,
        marginBottom: spacing[3],
    },
    paymentOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted,
    },
    paymentOptionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        borderColor: colors.primary,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    paymentOptionInfo: {
        marginLeft: spacing[1],
    },
    paymentOptionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    paymentOptionSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 2,
    },
    razorpayLogo: {
        width: 24,
        height: 24,
    },
    billCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[3],
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
    billTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    billTotalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.primary,
    },
    securityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        paddingVertical: spacing[6],
        opacity: 0.6,
    },
    securityText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        ...shadows.lg,
        shadowOffset: { width: 0, height: -4 },
    },
    bottomContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
        paddingBottom: spacing[8],
    },
    totalContainer: {},
    totalLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textSecondary,
        letterSpacing: 0.3,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    payButton: {
        flex: 1,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        ...shadows.lg,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
    },
    payButtonDisabled: {
        opacity: 0.7,
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
});
