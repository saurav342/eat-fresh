import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    StatusBar,
    SafeAreaView,
    FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { ShopCard, CategoryPill } from '../components';
import shopsData from '../data/shops.json';
import categoriesData from '../data/categories.json';
import { Shop, Category } from '../types';

const BANNER_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq1Yt-skzte7U_AUwseRQndVIVC34agHvpSG177KIYXvO9Jh8WM9DihMisF0LLNKjF6tecc6iD3OQLJMQCEff8FW8zVnB5AYxL2fLRuf5f9oBfvezuG3LzlVP7e7MeXQjIBNsZ0kDukXLRSqjc3_eZcv8x49pYk67RYDcC-ycblQ0yqHmNHfxSf1SlOmlvS70i6LFcH2KdByx519C8ucWc05MvK70wAkCEktZWnl6lCCgKv1-8zmoQWbo9_eFMkN6IrRZkuZ_ocghS';

const filters = [
    { id: 'near', label: 'Near Me', icon: 'storefront' as const },
    { id: 'top', label: 'Top Rated', icon: 'star' as const },
    { id: 'open', label: 'Open Now', icon: 'schedule' as const },
];

export default function HomeScreen() {
    const router = useRouter();
    const shops = shopsData.shops as Shop[];
    const categories = categoriesData.categories as Category[];

    const handleShopPress = (shopId: string) => {
        router.push(`/shop/${shopId}`);
    };

    const handleCategoryPress = (categoryId: string) => {
        // Navigate to category-filtered view
        console.log('Category pressed:', categoryId);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <SafeAreaView style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.locationContainer}>
                        <Text style={styles.locationLabel}>DELIVERING TO</Text>
                        <TouchableOpacity style={styles.locationButton}>
                            <Text style={styles.locationText}>Varthur, Bangalore</Text>
                            <MaterialIcons name="expand-more" size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.iconButton}>
                            <MaterialIcons name="notifications" size={22} color={colors.textPrimary} />
                            <View style={styles.notificationDot} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cartButton}
                            onPress={() => router.push('/cart')}
                        >
                            <MaterialIcons name="shopping-bag" size={22} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <MaterialIcons name="search" size={24} color={colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for shops, chicken, mutton..."
                            placeholderTextColor={colors.textSecondary}
                        />
                    </View>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filtersContainer}
                    contentContainerStyle={styles.filtersContent}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity key={filter.id} style={styles.filterChip}>
                            <MaterialIcons name={filter.icon} size={18} color={colors.primary} />
                            <Text style={styles.filterText}>{filter.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Banner */}
                <View style={styles.bannerContainer}>
                    <Image source={{ uri: BANNER_IMAGE }} style={styles.bannerImage} />
                    <View style={styles.bannerOverlay} />
                    <View style={styles.bannerContent}>
                        <View style={styles.bannerBadge}>
                            <Text style={styles.bannerBadgeText}>NEW IN VARTHUR</Text>
                        </View>
                        <Text style={styles.bannerTitle}>Support Local{'\n'}Butchers</Text>
                        <Text style={styles.bannerSubtitle}>Fresh from the market to your door.</Text>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Shop by Meat Type</Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <CategoryPill
                                key={category.id}
                                category={category}
                                onPress={() => handleCategoryPress(category.id)}
                            />
                        ))}
                    </View>
                </View>

                {/* Shops List */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Local Shops in Varthur</Text>
                        <TouchableOpacity style={styles.viewMapButton}>
                            <Text style={styles.viewMapText}>View Map</Text>
                            <MaterialIcons name="map" size={18} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.shopsList}>
                        {shops.map((shop) => (
                            <ShopCard
                                key={shop.id}
                                shop={shop}
                                onPress={() => handleShopPress(shop.id)}
                            />
                        ))}
                    </View>
                </View>
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
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        ...shadows.sm,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
    },
    locationContainer: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.5,
        marginBottom: spacing[0.5],
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.white,
    },
    cartButton: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.md,
        shadowColor: colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    searchContainer: {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing[4],
        height: 48,
        ...shadows.sm,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing[3],
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
    },
    filtersContainer: {
        marginBottom: spacing[4],
    },
    filtersContent: {
        paddingHorizontal: spacing[4],
        gap: spacing[3],
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
        marginRight: spacing[3],
    },
    filterText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    bannerContainer: {
        marginHorizontal: spacing[4],
        height: 180,
        borderRadius: borderRadius['2xl'],
        overflow: 'hidden',
        ...shadows.lg,
        marginBottom: spacing[6],
    },
    bannerImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bannerContent: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing[6],
    },
    bannerBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.DEFAULT,
        alignSelf: 'flex-start',
        marginBottom: spacing[2],
    },
    bannerBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: colors.white,
        letterSpacing: 0.5,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.white,
        lineHeight: 28,
        marginBottom: spacing[1],
    },
    bannerSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.85)',
    },
    sectionContainer: {
        marginBottom: spacing[8],
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        marginBottom: spacing[5],
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        paddingHorizontal: spacing[4],
        marginBottom: spacing[5],
    },
    viewMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
    },
    viewMapText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    categoriesGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: spacing[4],
    },
    shopsList: {
        paddingHorizontal: spacing[4],
        gap: spacing[4],
    },
});
