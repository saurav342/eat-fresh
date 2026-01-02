import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { QuantitySelector } from '../components';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';
import shopsData from '../data/shops.json';
import { Product } from '../types';

const { height } = Dimensions.get('window');

export default function ProductDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { addItem, getItemQuantity, updateQuantity } = useCart();
    const [localQty, setLocalQty] = useState(1);

    const product = useMemo(
        () => productsData.products.find((p) => p.id === id) as Product | undefined,
        [id]
    );

    const shop = useMemo(
        () => product && shopsData.shops.find((s) => s.id === product.shopId),
        [product]
    );

    const addons = productsData.addons;
    const cartQty = product ? getItemQuantity(product.id) : 0;

    if (!product) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Product not found</Text>
            </SafeAreaView>
        );
    }

    const handleAddToCart = () => {
        if (shop) {
            for (let i = 0; i < localQty; i++) {
                addItem(product, shop.name);
            }
            router.back();
        }
    };

    const hasDiscount = product.originalPrice && product.discount;
    const totalPrice = product.price * localQty;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Hero Image */}
            <View style={styles.heroContainer}>
                <Image source={{ uri: product.image }} style={styles.heroImage} />
                <View style={styles.heroGradient} />

                {/* Floating Header Buttons */}
                <SafeAreaView style={styles.floatingHeader}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back" size={20} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerButton}>
                            <MaterialIcons name="favorite-border" size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.headerButton}
                            onPress={() => router.push('/cart')}
                        >
                            <MaterialIcons name="shopping-bag" size={20} color={colors.textPrimary} />
                            {cartQty > 0 && <View style={styles.cartDot} />}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Content Card */}
                <View style={styles.contentCard}>
                    {/* Source Badge */}
                    {product.source && (
                        <View style={styles.sourceBadge}>
                            <MaterialIcons name="agriculture" size={16} color={colors.primary} />
                            <Text style={styles.sourceBadgeText}>
                                SOURCED FROM {product.source.toUpperCase()}
                            </Text>
                        </View>
                    )}

                    {/* Title */}
                    <Text style={styles.title}>{product.name}</Text>

                    {/* Rating & Category */}
                    <View style={styles.metaRow}>
                        {product.rating && (
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>{product.rating}</Text>
                                <MaterialIcons name="star" size={14} color="#f59e0b" />
                            </View>
                        )}
                        {product.reviewCount && (
                            <Text style={styles.reviewsText}>{product.reviewCount / 1000}k reviews</Text>
                        )}
                        <View style={styles.metaDot} />
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>

                    {/* Price & Weight Cards */}
                    <View style={styles.infoCardsRow}>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoCardLabel}>PRICE</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>₹{product.price}</Text>
                                {hasDiscount && (
                                    <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                                )}
                            </View>
                            {hasDiscount && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{product.discount}% OFF</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoCardLabel}>NET WEIGHT</Text>
                            <Text style={styles.weight}>{product.weight}</Text>
                            {product.pieces && (
                                <Text style={styles.piecesText}>Approx {product.pieces}</Text>
                            )}
                        </View>
                    </View>

                    {/* Features Pills */}
                    {product.features && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.featuresContainer}
                            contentContainerStyle={styles.featuresContent}
                        >
                            {product.serves && (
                                <View style={styles.featurePill}>
                                    <View style={[styles.featureIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
                                        <MaterialIcons name="restaurant" size={16} color="#f97316" />
                                    </View>
                                    <Text style={styles.featureText}>Serves {product.serves}</Text>
                                </View>
                            )}
                            <View style={styles.featurePill}>
                                <View style={[styles.featureIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                    <MaterialIcons name="water-drop" size={16} color="#3b82f6" />
                                </View>
                                <Text style={styles.featureText}>Hygienically Cleaned</Text>
                            </View>
                            <View style={styles.featurePill}>
                                <View style={[styles.featureIcon, { backgroundColor: colors.primaryMuted }]}>
                                    <MaterialIcons name="verified" size={16} color={colors.primary} />
                                </View>
                                <Text style={styles.featureText}>Halal Certified</Text>
                            </View>
                        </ScrollView>
                    )}

                    {/* Description */}
                    {product.description && (
                        <View style={styles.descriptionSection}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.descriptionText}>{product.description}</Text>
                        </View>
                    )}

                    {/* Delivery Info */}
                    <View style={styles.deliveryCard}>
                        <View style={styles.deliveryIcon}>
                            <MaterialIcons name="electric-scooter" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.deliveryInfo}>
                            <View style={styles.deliveryTimeRow}>
                                <Text style={styles.deliveryTimeText}>Earliest Delivery in 45 mins</Text>
                                <View style={styles.pulseDot} />
                            </View>
                            <Text style={styles.deliveryLocation}>to Indiranagar, Bangalore</Text>
                        </View>
                    </View>

                    {/* Frequently Bought Together */}
                    <View style={styles.suggestionsSection}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Frequently Bought Together</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAllText}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.addonsContent}
                        >
                            {addons.slice(0, 3).map((addon) => (
                                <View key={addon.id} style={styles.addonCard}>
                                    <Image source={{ uri: addon.image }} style={styles.addonImage} />
                                    <Text style={styles.addonName} numberOfLines={1}>
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
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <SafeAreaView style={styles.bottomBar}>
                <View style={styles.bottomContent}>
                    <QuantitySelector
                        quantity={localQty}
                        onDecrement={() => setLocalQty((q) => Math.max(1, q - 1))}
                        onIncrement={() => setLocalQty((q) => q + 1)}
                        size="large"
                    />
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                        <View style={styles.addToCartLeft}>
                            <Text style={styles.totalLabel}>TOTAL</Text>
                            <Text style={styles.totalPrice}>₹{totalPrice}</Text>
                        </View>
                        <View style={styles.addToCartRight}>
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                            <MaterialIcons name="shopping-cart" size={20} color={colors.white} />
                        </View>
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
    heroContainer: {
        height: height * 0.45,
        position: 'relative',
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4],
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
        position: 'relative',
    },
    headerRight: {
        flexDirection: 'row',
        gap: spacing[3],
    },
    cartDot: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.white,
    },
    scrollView: {
        flex: 1,
        marginTop: -40,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    contentCard: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: spacing[8],
        paddingHorizontal: spacing[5],
        ...shadows.lg,
        shadowOffset: { width: 0, height: -10 },
    },
    sourceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        alignSelf: 'flex-start',
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.2)',
        marginBottom: spacing[3],
    },
    sourceBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.4,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        lineHeight: 30,
        marginBottom: spacing[3],
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        paddingHorizontal: spacing[1.5],
        paddingVertical: spacing[0.5],
        borderRadius: borderRadius.DEFAULT,
        borderWidth: 1,
        borderColor: 'rgba(249, 115, 22, 0.2)',
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#f59e0b',
    },
    reviewsText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
    },
    metaDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.borderLight,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    infoCardsRow: {
        flexDirection: 'row',
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    infoCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    infoCardLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        letterSpacing: 0.5,
        marginBottom: spacing[1],
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: spacing[2],
    },
    price: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.textPrimary,
    },
    originalPrice: {
        fontSize: 14,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[0.5],
        borderRadius: borderRadius.DEFAULT,
        alignSelf: 'flex-start',
        marginTop: spacing[1],
    },
    discountText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },
    weight: {
        fontSize: 24,
        fontWeight: '900',
        color: colors.textPrimary,
    },
    piecesText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textSecondary,
        marginTop: spacing[0.5],
    },
    featuresContainer: {
        marginBottom: spacing[4],
    },
    featuresContent: {
        gap: spacing[3],
    },
    featurePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        paddingLeft: spacing[3],
        paddingRight: spacing[4],
        paddingVertical: spacing[2],
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.full,
        marginRight: spacing[3],
    },
    featureIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    descriptionSection: {
        marginBottom: spacing[4],
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing[2],
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 22,
        color: colors.textSecondary,
    },
    deliveryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        backgroundColor: colors.primaryMuted,
        borderRadius: borderRadius.xl,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.1)',
        marginBottom: spacing[6],
    },
    deliveryIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    deliveryInfo: {
        flex: 1,
    },
    deliveryTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
    },
    deliveryTimeText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
    },
    deliveryLocation: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing[0.5],
    },
    suggestionsSection: {
        marginBottom: spacing[4],
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    viewAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },
    addonsContent: {
        gap: spacing[4],
    },
    addonCard: {
        width: 150,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[2],
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
        marginRight: spacing[4],
    },
    addonImage: {
        width: '100%',
        height: 96,
        borderRadius: borderRadius.lg,
        marginBottom: spacing[2],
    },
    addonName: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing[1],
    },
    addonBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addonPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    addonAddButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primaryMuted,
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[4],
        paddingBottom: spacing[8],
    },
    addToCartButton: {
        flex: 1,
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing[6],
        ...shadows.lg,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
    },
    addToCartLeft: {
        flexDirection: 'column',
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 0.5,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.white,
    },
    addToCartRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    addToCartText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.white,
    },
});
