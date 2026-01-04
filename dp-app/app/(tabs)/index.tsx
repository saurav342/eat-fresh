import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { fontFamilies, fontSizes } from '../../src/theme/typography';
import { borderRadius, shadows, spacing } from '../../src/theme/spacing';
import { deliveryAPI } from '../../src/services/api';

const { width } = Dimensions.get('window');

interface OrderRequest {
    id: string;
    _id?: string;
    orderId?: string;
    shopName: string;
    shopAddress?: string;
    pickupAddress?: string;
    dropAddress?: string;
    deliveryAddress?: { address: string };
    distance?: string;
    duration?: string;
    earnings?: number;
    grandTotal?: number;
    mapImage?: string;
}

interface Earnings {
    todayEarnings: number;
    todayDeliveries: number;
    weeklyEarnings: number;
    totalEarnings: number;
}

export default function DashboardScreen() {
    const [isOnline, setIsOnline] = useState(true);
    const [orders, setOrders] = useState<OrderRequest[]>([]);
    const [earnings, setEarnings] = useState<Earnings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [ordersRes, earningsRes] = await Promise.all([
                deliveryAPI.getAssignedOrders(),
                deliveryAPI.getEarnings(),
            ]);
            setOrders(ordersRes.orders || []);
            setEarnings(earningsRes.earnings);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Use mock data as fallback for demo
            setOrders([
                {
                    id: '1',
                    shopName: "Nandu's Chicken",
                    shopAddress: 'Varthur Main Rd, near Police Station',
                    pickupAddress: "Nandu's Chicken",
                    dropAddress: 'Sobha Dream Acres, Wing 4',
                    distance: '2.5 km',
                    duration: '15 min',
                    earnings: 65,
                    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
                },
            ]);
            setEarnings({ todayEarnings: 850, todayDeliveries: 5, weeklyEarnings: 5600, totalEarnings: 186750 });
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    const handleToggleOnline = async () => {
        try {
            const newStatus = isOnline ? 'offline' : 'online';
            await deliveryAPI.updateStatus(newStatus);
            setIsOnline(!isOnline);
        } catch (error) {
            console.error('Error updating status:', error);
            // Toggle anyway for demo
            setIsOnline(!isOnline);
        }
    };

    const handleAcceptOrder = (orderId: string) => {
        router.push(`/order/${orderId}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Top App Bar */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }}
                            style={styles.avatar}
                        />
                        <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
                    </View>
                    <View>
                        <Text style={styles.greeting}>Good Morning</Text>
                        <Text style={styles.userName}>Rahul!</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[styles.onlineToggle, isOnline && styles.onlineToggleActive]}
                    onPress={() => setIsOnline(!isOnline)}
                >
                    <Ionicons
                        name={isOnline ? 'toggle' : 'toggle-outline'}
                        size={24}
                        color={isOnline ? colors.success : colors.textMuted}
                    />
                    <Text style={[styles.onlineText, isOnline && styles.onlineTextActive]}>
                        {isOnline ? 'Online' : 'Offline'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    {/* Earnings Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIcon, { backgroundColor: colors.primaryMuted }]}>
                                <Ionicons name="cash-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.statBadge}>
                                <Text style={styles.statBadgeText}>+12%</Text>
                            </View>
                        </View>
                        <Text style={styles.statLabel}>Today's Earnings</Text>
                        <Text style={styles.statValue}>₹850</Text>
                    </View>

                    {/* Trips Card */}
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
                                <Ionicons name="bicycle" size={20} color="#3b82f6" />
                            </View>
                        </View>
                        <Text style={styles.statLabel}>Trips Completed</Text>
                        <Text style={styles.statValue}>5</Text>
                    </View>
                </View>

                {/* New Requests Header */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        New Requests <Text style={styles.sectionCount}>(2)</Text>
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.viewMapText}>View Map</Text>
                    </TouchableOpacity>
                </View>

                {/* Order Request Cards */}
                {orders.map((order: OrderRequest, index: number) => (
                    <View
                        key={order.id}
                        style={[
                            styles.orderCard,
                            index > 0 && styles.orderCardSecondary,
                        ]}
                    >
                        {/* Map Preview */}
                        <View style={styles.mapContainer}>
                            <Image source={{ uri: order.mapImage }} style={styles.mapImage} />
                            <View style={styles.mapOverlay} />
                            <View style={styles.distanceBadge}>
                                <Text style={styles.distanceText}>
                                    {order.distance} • {order.duration}
                                </Text>
                            </View>
                            <View style={styles.earningsContainer}>
                                <Text style={styles.earningsLabel}>Estimated Earnings</Text>
                                <Text style={styles.earningsValue}>₹{order.earnings}</Text>
                            </View>
                        </View>

                        <View style={styles.orderContent}>
                            {/* Shop Info */}
                            <View style={styles.shopInfo}>
                                <View style={styles.shopIcon}>
                                    <Ionicons name="restaurant" size={24} color="#ea580c" />
                                </View>
                                <View style={styles.shopDetails}>
                                    <Text style={styles.shopName}>{order.shopName}</Text>
                                    <Text style={styles.shopAddress} numberOfLines={1}>
                                        {order.shopAddress}
                                    </Text>
                                </View>
                            </View>

                            {/* Route Timeline */}
                            <View style={styles.timeline}>
                                <View style={styles.timelineItem}>
                                    <View style={[styles.timelineDot, styles.timelineDotPickup]} />
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.timelineLabel}>PICKUP</Text>
                                        <Text style={styles.timelineAddress}>{order.pickupAddress}</Text>
                                    </View>
                                </View>
                                <View style={styles.timelineLine} />
                                <View style={styles.timelineItem}>
                                    <View style={[styles.timelineDot, styles.timelineDotDrop]} />
                                    <View style={styles.timelineContent}>
                                        <Text style={styles.timelineLabel}>DROP OFF</Text>
                                        <Text style={styles.timelineAddress}>{order.dropAddress}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={styles.orderActions}>
                                <TouchableOpacity style={styles.declineButton}>
                                    <Text style={styles.declineButtonText}>Decline</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={() => handleAcceptOrder(order.id)}
                                >
                                    <Text style={styles.acceptButtonText}>Accept Order</Text>
                                    <Ionicons name="arrow-forward" size={18} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Recent Activity */}
                <View style={styles.recentSection}>
                    <View style={styles.recentHeader}>
                        <Text style={styles.recentTitle}>RECENT ACTIVITY</Text>
                        <View style={styles.recentDivider} />
                    </View>
                    <View style={styles.recentCard}>
                        <View style={styles.recentIcon}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                        </View>
                        <View style={styles.recentContent}>
                            <Text style={styles.recentText}>Delivered to Swetha</Text>
                            <Text style={styles.recentTime}>10:30 AM • Varthur Kodi</Text>
                        </View>
                        <Text style={styles.recentEarnings}>+₹55</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.white,
    },
    statusDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.textMuted,
        borderWidth: 2,
        borderColor: colors.background,
    },
    statusDotOnline: {
        backgroundColor: colors.success,
    },
    greeting: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.xs,
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    userName: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
    },
    onlineToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
        gap: spacing[1],
    },
    onlineToggleActive: {
        backgroundColor: colors.successLight,
    },
    onlineText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textMuted,
    },
    onlineTextActive: {
        color: colors.success,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing[4],
        paddingTop: spacing[6],
    },
    statsContainer: {
        flexDirection: 'row',
        gap: spacing[4],
        marginBottom: spacing[6],
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[5],
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[4],
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statBadge: {
        backgroundColor: colors.successLight,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.lg,
    },
    statBadgeText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.success,
    },
    statLabel: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        marginBottom: spacing[1],
    },
    statValue: {
        fontFamily: fontFamilies.extraBold,
        fontSize: fontSizes['2xl'],
        color: colors.textPrimary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    sectionTitle: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xl,
        color: colors.textPrimary,
    },
    sectionCount: {
        color: colors.primary,
    },
    viewMapText: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.base,
        color: colors.primary,
    },
    orderCard: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginBottom: spacing[4],
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    orderCardSecondary: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    mapContainer: {
        height: 128,
        backgroundColor: colors.borderLight,
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    distanceBadge: {
        position: 'absolute',
        top: spacing[3],
        right: spacing[3],
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.lg,
    },
    distanceText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textPrimary,
    },
    earningsContainer: {
        position: 'absolute',
        bottom: spacing[3],
        left: spacing[3],
    },
    earningsLabel: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.xs,
        color: 'rgba(255,255,255,0.9)',
    },
    earningsValue: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xl,
        color: colors.white,
    },
    orderContent: {
        padding: spacing[4],
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    shopIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.xl,
        backgroundColor: '#fff7ed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shopDetails: {
        flex: 1,
    },
    shopName: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
    },
    shopAddress: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
    },
    timeline: {
        marginLeft: spacing[2],
        paddingLeft: spacing[4],
        borderLeftWidth: 2,
        borderLeftColor: colors.borderLight,
        borderStyle: 'dashed',
        marginBottom: spacing[4],
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: spacing[2],
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginLeft: -22,
        marginRight: spacing[3],
    },
    timelineDotPickup: {
        backgroundColor: colors.primary,
    },
    timelineDotDrop: {
        backgroundColor: colors.success,
    },
    timelineLine: {
        height: spacing[2],
    },
    timelineContent: {
        flex: 1,
    },
    timelineLabel: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textSecondary,
        letterSpacing: 0.5,
        marginBottom: spacing[0.5],
    },
    timelineAddress: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
    },
    orderActions: {
        flexDirection: 'row',
        gap: spacing[3],
        marginTop: spacing[2],
    },
    declineButton: {
        flex: 1,
        height: 48,
        backgroundColor: '#f1f1f1',
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineButtonText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
    },
    acceptButton: {
        flex: 2,
        height: 48,
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        ...shadows.primary,
    },
    acceptButtonText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.white,
    },
    recentSection: {
        marginTop: spacing[4],
    },
    recentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        marginBottom: spacing[3],
        opacity: 0.6,
    },
    recentTitle: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.sm,
        color: colors.textPrimary,
        letterSpacing: 1,
    },
    recentDivider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.textPrimary,
    },
    recentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing[4],
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.borderLight,
        borderRadius: borderRadius.xl,
    },
    recentIcon: {
        backgroundColor: colors.successLight,
        padding: spacing[2],
        borderRadius: borderRadius.lg,
    },
    recentContent: {
        flex: 1,
        marginLeft: spacing[3],
    },
    recentText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
    },
    recentTime: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        color: colors.textSecondary,
    },
    recentEarnings: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.md,
        color: colors.success,
    },
});
