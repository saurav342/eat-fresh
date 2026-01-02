import React, { useState, useMemo } from 'react';
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
import { ProductCard, FloatingCartBar } from '../components';
import { useCart } from '../context/CartContext';
import shopsData from '../data/shops.json';
import productsData from '../data/products.json';
import { Shop, Product } from '../types';

const tabs = ['Best Sellers', 'Chicken', 'Mutton', 'Fish & Prawns'];

export default function ShopDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState(0);
    const { items, totalItems, totalAmount, addItem, updateQuantity, getItemQuantity } = useCart();

    const shop = useMemo(
        () => shopsData.shops.find((s) => s.id === id) as Shop | undefined,
        [id]
    );

    const products = useMemo(
        () => productsData.products.filter((p) => p.shopId === id) as Product[],
        [id]
    );

    if (!shop) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Shop not found</Text>
            </SafeAreaView>
        );
    }

    const handleProductPress = (productId: string) => {
        router.push(`/product/${productId}`);
    };

    const handleAddProduct = (product: Product) => {
        addItem(product, shop.name);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Sticky Header */}
            <SafeAreaView style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {shop.name}
                    </Text>
                    <TouchableOpacity style={styles.searchButton}>
                        <MaterialIcons name="search" size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Shop Header Image */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: shop.image }} style={styles.heroImage} />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveBadgeText}>LIVE NOW</Text>
                    </View>
                    <View style={styles.heroContent}>
                        <Text style={styles.shopName}>{shop.name}</Text>
                        <Text style={styles.shopSubtitle}>Premium Quality Meats & Seafood</Text>
                    </View>
                </View>

                {/* Meta Info Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.metaContainer}
                    contentContainerStyle={styles.metaContent}
                >
                    <View style={[styles.metaPill, styles.metaPillPrimary]}>
                        <MaterialIcons name="schedule" size={16} color={colors.success} />
                        <Text style={[styles.metaText, styles.metaTextPrimary]}>
                            Open until 8 PM
                        </Text>
                    </View>
                    <View style={styles.metaPill}>
                        <MaterialIcons name="two-wheeler" size={16} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{shop.deliveryTime}</Text>
                    </View>
                    <View style={styles.metaPill}>
                        <MaterialIcons name="location-on" size={16} color={colors.textSecondary} />
                        <Text style={styles.metaText}>{shop.address}</Text>
                    </View>
                </ScrollView>

                {/* Rating Card */}
                <View style={styles.ratingCard}>
                    <View style={styles.ratingLeft}>
                        <View style={styles.ratingBadge}>
                            <Text style={styles.ratingValue}>{shop.rating}</Text>
                        </View>
                        <View style={styles.ratingInfo}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <MaterialIcons
                                        key={i}
                                        name={i <= Math.floor(shop.rating) ? 'star' : 'star-half'}
                                        size={16}
                                        color={colors.primary}
                                    />
                                ))}
                            </View>
                            <Text style={styles.reviewCount}>Based on {shop.reviewCount} reviews</Text>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.readAllText}>Read all</Text>
                    </TouchableOpacity>
                </View>

                {/* Category Tabs */}
                <View style={styles.tabsWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabsContainer}
                    >
                        {tabs.map((tab, index) => (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tab, activeTab === index && styles.tabActive]}
                                onPress={() => setActiveTab(index)}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeTab === index && styles.tabTextActive,
                                    ]}
                                >
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Products Grid */}
                <View style={styles.productsGrid}>
                    {products.map((product) => (
                        <View key={product.id} style={styles.productWrapper}>
                            <ProductCard
                                product={product}
                                quantity={getItemQuantity(product.id)}
                                onAdd={() => handleAddProduct(product)}
                                onUpdateQuantity={(qty) => updateQuantity(product.id, qty)}
                                onPress={() => handleProductPress(product.id)}
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Cart Bar */}
            <FloatingCartBar
                itemCount={totalItems}
                total={totalAmount}
                onPress={() => router.push('/cart')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        backgroundColor: colors.background,
        zIndex: 30,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
    },
    backButton: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
        marginHorizontal: spacing[4],
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 150,
    },
    heroContainer: {
        marginHorizontal: spacing[4],
        marginTop: spacing[3],
        height: 220,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        position: 'relative',
        ...shadows.md,
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroBadge: {
        position: 'absolute',
        top: spacing[4],
        right: spacing[4],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
        gap: spacing[1],
        ...shadows.lg,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0d1c13',
    },
    liveBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    heroContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing[5],
    },
    shopName: {
        fontSize: 30,
        fontWeight: '700',
        color: colors.white,
        marginBottom: spacing[1],
    },
    shopSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.9)',
    },
    metaContainer: {
        marginTop: spacing[3],
    },
    metaContent: {
        paddingHorizontal: spacing[4],
        gap: spacing[2],
    },
    metaPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1.5],
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing[2],
    },
    metaPillPrimary: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.2)',
    },
    metaText: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textSecondary,
    },
    metaTextPrimary: {
        color: colors.success,
        fontWeight: '600',
    },
    ratingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: spacing[4],
        marginTop: spacing[4],
        padding: spacing[4],
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    ratingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    ratingBadge: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.DEFAULT,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.success,
    },
    ratingInfo: {
        gap: spacing[1],
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewCount: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    readAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.primary,
    },
    tabsWrapper: {
        marginTop: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tabsContainer: {
        paddingHorizontal: spacing[4],
        gap: spacing[6],
    },
    tab: {
        paddingBottom: spacing[3],
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        marginRight: spacing[6],
    },
    tabActive: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.textPrimary,
    },
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: spacing[4],
        gap: spacing[4],
    },
    productWrapper: {
        width: '47%',
    },
});
