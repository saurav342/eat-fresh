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
import { useRouter } from 'expo-router';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { QuantitySelector } from '../components';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';

export default function CartScreen() {
    const router = useRouter();
    const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart();

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

    const addons = productsData.addons.slice(0, 3);

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <StatusBar barStyle="dark-content" />
                <SafeAreaView style={styles.emptyHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Cart</Text>
                    <View style={{ width: 48 }} />
                </SafeAreaView>
                <View style={styles.emptyContent}>
                    <MaterialIcons name="shopping-cart" size={80} color={colors.borderLight} />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add some fresh items to get started!</Text>
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
                    <Text style={styles.headerTitle}>My Cart ({totalItems} Items)</Text>
                    <TouchableOpacity onPress={clearCart}>
                        <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Delivery Address */}
                <View style={styles.addressCard}>
                    <View style={styles.addressLeft}>
                        <View style={styles.addressIcon}>
                            <MaterialIcons name="location-on" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.addressInfo}>
                            <Text style={styles.addressLabel}>DELIVERING TO HOME</Text>
                            <Text style={styles.addressText} numberOfLines={1}>
                                123, 4th Cross, Indiranagar
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.changeButton}>
                        <Text style={styles.changeButtonText}>Change</Text>
                    </TouchableOpacity>
                </View>

                {/* Delivery Time Banner */}
                <View style={styles.deliveryBanner}>
                    <MaterialIcons name="schedule" size={20} color={colors.success} />
                    <Text style={styles.deliveryBannerText}>
                        Delivery in <Text style={styles.deliveryBannerBold}>45 mins</Text> to Indiranagar
                    </Text>
                </View>

                {/* Cart Items grouped by Shop */}
                {Object.values(groupedItems).map((group) => (
                    <View key={group.shopId} style={styles.shopGroup}>
                        <View style={styles.shopHeader}>
                            <MaterialIcons name="storefront" size={20} color={colors.primary} />
                            <Text style={styles.shopName}>{group.shopName}</Text>
                            <View style={styles.shopRatingBadge}>
                                <Text style={styles.shopRatingText}>4.8 ★</Text>
                            </View>
                        </View>

                        {group.items.map((item) => (
                            <View key={item.id} style={styles.cartItemCard}>
                                <View style={styles.cartItemContent}>
                                    <Image
                                        source={{ uri: item.product.image }}
                                        style={styles.cartItemImage}
                                    />
                                    <View style={styles.cartItemDetails}>
                                        <View style={styles.cartItemHeader}>
                                            <Text style={styles.cartItemName} numberOfLines={1}>
                                                {item.product.name}
                                            </Text>
                                            <TouchableOpacity onPress={() => removeItem(item.id)}>
                                                <MaterialIcons
                                                    name="delete"
                                                    size={20}
                                                    color={colors.textSecondary}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.cartItemWeight}>{item.product.weight}</Text>
                                        <View style={styles.cartItemFooter}>
                                            <Text style={styles.cartItemPrice}>
                                                ₹{item.product.price * item.quantity}
                                            </Text>
                                            <QuantitySelector
                                                quantity={item.quantity}
                                                onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                                                onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                                                size="small"
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}

                {/* You might also need */}
                <View style={styles.suggestionsSection}>
                    <Text style={styles.sectionTitle}>You might also need</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.addonsContent}
                    >
                        {addons.map((addon) => (
                            <View key={addon.id} style={styles.addonCard}>
                                <Image source={{ uri: addon.image }} style={styles.addonImage} />
                                <Text style={styles.addonName} numberOfLines={2}>
                                    {addon.name}
                                </Text>
                                <View style={styles.addonBottom}>
                                    <Text style={styles.addonPrice}>₹{addon.price}</Text>
                                    <TouchableOpacity style={styles.addonAddButton}>
                                        <MaterialIcons name="add" size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Apply Coupon */}
                <TouchableOpacity style={styles.couponCard}>
                    <View style={styles.couponLeft}>
                        <View style={styles.couponIcon}>
                            <MaterialIcons name="local-offer" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.couponInfo}>
                            <Text style={styles.couponTitle}>Apply Coupon</Text>
                            <Text style={styles.couponSubtitle}>Save more on your order</Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Bill Details */}
                <View style={styles.billSection}>
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
                            <Text style={[styles.billLabel, styles.billLabelDotted]}>
                                Taxes & Charges
                            </Text>
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
                    <Text style={styles.securityText}>Safe and Secure Payments</Text>
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
                        style={styles.checkoutButton}
                        onPress={() => router.push('/checkout')}
                    >
                        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                        <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
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
    clearText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 150,
    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: spacing[4],
        padding: spacing[3],
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
        width: 40,
        height: 40,
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
        fontWeight: '600',
        color: colors.textSecondary,
        letterSpacing: 0.3,
        marginBottom: 2,
    },
    addressText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    changeButton: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
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
        marginBottom: spacing[4],
        padding: spacing[2.5],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: borderRadius.DEFAULT,
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
        marginHorizontal: spacing[4],
        marginBottom: spacing[6],
    },
    shopHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: spacing[3],
        paddingHorizontal: spacing[1],
    },
    shopName: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    shopRatingBadge: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[1.5],
        paddingVertical: spacing[0.5],
        borderRadius: borderRadius.DEFAULT,
    },
    shopRatingText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.primary,
    },
    cartItemCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing[3],
        marginBottom: spacing[3],
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    cartItemContent: {
        flexDirection: 'row',
        gap: spacing[4],
    },
    cartItemImage: {
        width: 96,
        height: 96,
        borderRadius: borderRadius.DEFAULT,
    },
    cartItemDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cartItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cartItemName: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        flex: 1,
        marginRight: spacing[2],
    },
    cartItemWeight: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    cartItemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 'auto',
    },
    cartItemPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    suggestionsSection: {
        marginTop: spacing[4],
        paddingLeft: spacing[4],
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing[3],
    },
    addonsContent: {
        paddingRight: spacing[4],
    },
    addonCard: {
        width: 144,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        padding: spacing[2],
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing[4],
        ...shadows.sm,
    },
    addonImage: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: borderRadius.DEFAULT,
        marginBottom: spacing[2],
    },
    addonName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
        height: 40,
        lineHeight: 20,
    },
    addonBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing[2],
    },
    addonPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    addonAddButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    couponCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: spacing[4],
        marginTop: spacing[6],
        padding: spacing[4],
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.primary,
    },
    couponLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    couponIcon: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
    },
    couponInfo: {},
    couponTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    couponSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.primary,
        marginTop: 2,
    },
    billSection: {
        margin: spacing[4],
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
    billLabelDotted: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
    },
    billValue: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    billValueGreen: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.success,
    },
    billDivider: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing[1],
    },
    billTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    billTotalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    securityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        paddingVertical: spacing[4],
        paddingHorizontal: spacing[8],
        opacity: 0.6,
        marginBottom: spacing[24],
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
    totalContainer: {
        flexDirection: 'column',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textSecondary,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    checkoutButton: {
        flex: 1,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing[6],
        ...shadows.lg,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
    },
    checkoutText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
});
