import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { fontFamilies, fontSizes } from '../../src/theme/typography';
import { borderRadius, shadows, spacing } from '../../src/theme/spacing';

const { width } = Dimensions.get('window');

const orderData = {
    id: '9281',
    status: 'Ready for Pickup',
    timerMin: 14,
    timerSec: 32,
    distance: '2.4 km',
    duration: '12 mins',
    paymentMethod: 'Cash on Delivery',
    totalAmount: 450,
    shop: {
        name: 'Nandhini Chicken Stall',
        address: '12, Varthur Main Rd, Bangalore',
        logo: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200',
    },
    customer: {
        name: 'Rahul K.',
        address: 'Prestige Lakeside Habitat, Varthur Gunjur Road',
        dropTime: '12:45 PM',
    },
    items: [
        { name: 'Chicken Skinless Curry Cut', quantity: '1kg', price: 280, icon: 'egg' },
        { name: 'Mutton Liver', quantity: '250g', price: 170, icon: 'nutrition' },
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800',
};

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams();

    const handleNavigate = () => {
        router.push('/navigation');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order #{orderData.id}</Text>
                <TouchableOpacity style={styles.helpButton}>
                    <Text style={styles.helpText}>Help</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Status & Timer */}
                <View style={styles.statusSection}>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>STATUS: {orderData.status.toUpperCase()}</Text>
                    </View>

                    <View style={styles.timerContainer}>
                        <View style={styles.timerBox}>
                            <Text style={styles.timerValue}>{orderData.timerMin}</Text>
                            <Text style={styles.timerLabel}>Min</Text>
                        </View>
                        <Text style={styles.timerSeparator}>:</Text>
                        <View style={styles.timerBox}>
                            <Text style={[styles.timerValue, { color: colors.textPrimary }]}>{orderData.timerSec}</Text>
                            <Text style={styles.timerLabel}>Sec</Text>
                        </View>
                    </View>
                </View>

                {/* Map */}
                <View style={styles.mapContainer}>
                    <Image source={{ uri: orderData.mapImage }} style={styles.mapImage} />
                    <View style={styles.mapOverlay} />
                    <View style={styles.distanceBadge}>
                        <Ionicons name="navigate" size={14} color={colors.primary} />
                        <Text style={styles.distanceText}>{orderData.distance} • {orderData.duration}</Text>
                    </View>
                    <TouchableOpacity style={styles.expandButton}>
                        <Ionicons name="expand" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Timeline */}
                <View style={styles.timeline}>
                    {/* Pickup Stop */}
                    <View style={styles.timelineStop}>
                        <View style={styles.timelineHeader}>
                            <View style={styles.timelineIconPickup}>
                                <Ionicons name="storefront" size={18} color={colors.white} />
                            </View>
                            <View style={styles.timelineHeaderContent}>
                                <Text style={styles.timelineLabel}>PICKUP</Text>
                                <Text style={styles.timelineSubLabel}>Order is ready</Text>
                            </View>
                        </View>

                        <View style={styles.timelineCard}>
                            <View style={styles.shopHeader}>
                                <View>
                                    <Text style={styles.shopName}>{orderData.shop.name}</Text>
                                    <Text style={styles.shopAddress}>{orderData.shop.address}</Text>
                                </View>
                                <Image source={{ uri: orderData.shop.logo }} style={styles.shopLogo} />
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
                                    <Ionicons name="navigate" size={18} color={colors.white} />
                                    <Text style={styles.navigateText}>Navigate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.callButton}>
                                    <Ionicons name="call" size={20} color={colors.textPrimary} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.itemsSection}>
                                <Text style={styles.itemsHeader}>2 ITEMS TO COLLECT</Text>
                                {orderData.items.map((item, index) => (
                                    <View key={index} style={styles.itemRow}>
                                        <View style={[styles.itemIcon, { backgroundColor: index === 0 ? '#fef3c7' : '#fee2e2' }]}>
                                            <Ionicons
                                                name={item.icon as any}
                                                size={16}
                                                color={index === 0 ? '#d97706' : '#dc2626'}
                                            />
                                        </View>
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                            <Text style={styles.itemPrice}>₹{item.price}</Text>
                                        </View>
                                        <View style={styles.itemQuantity}>
                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.timelineLine} />

                    {/* Drop Stop */}
                    <View style={[styles.timelineStop, styles.timelineStopInactive]}>
                        <View style={styles.timelineHeader}>
                            <View style={styles.timelineIconDrop}>
                                <Ionicons name="home" size={18} color={colors.textMuted} />
                            </View>
                            <View style={styles.timelineHeaderContent}>
                                <Text style={styles.timelineLabel}>DROP</Text>
                                <Text style={styles.timelineSubLabel}>Est. {orderData.customer.dropTime}</Text>
                            </View>
                        </View>

                        <View style={[styles.timelineCard, styles.timelineCardInactive]}>
                            <View>
                                <Text style={styles.shopName}>{orderData.customer.name}</Text>
                                <Text style={styles.shopAddress} numberOfLines={2}>
                                    {orderData.customer.address}
                                </Text>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity style={[styles.navigateButton, styles.navigateButtonInactive]}>
                                    <Ionicons name="navigate" size={18} color={colors.textSecondary} />
                                    <Text style={[styles.navigateText, { color: colors.textSecondary }]}>Navigate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.callButton}>
                                    <Ionicons name="call" size={20} color={colors.textSecondary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Banner */}
                <View style={styles.paymentBanner}>
                    <View style={styles.paymentIcon}>
                        <Ionicons name="cash-outline" size={24} color={colors.white} />
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentMethod}>{orderData.paymentMethod}</Text>
                        <Text style={styles.paymentSubtext}>Collect from customer</Text>
                    </View>
                    <Text style={styles.paymentAmount}>₹{orderData.totalAmount}</Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Swipe Action */}
            <View style={styles.bottomAction}>
                <View style={styles.swipeContainer}>
                    <View style={styles.swipeTextContainer}>
                        <Text style={styles.swipeText}>Slide to Confirm Pickup</Text>
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ opacity: 0.6, marginLeft: -8 }} />
                        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ opacity: 0.3, marginLeft: -8 }} />
                    </View>
                    <View style={styles.swipeKnob}>
                        <Ionicons name="checkmark" size={24} color={colors.white} />
                    </View>
                </View>
            </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    backButton: {
        padding: spacing[2],
    },
    headerTitle: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
    },
    helpButton: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
    },
    helpText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing[4],
        paddingTop: spacing[6],
    },
    statusSection: {
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.successLight,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: '#bbf7d0',
        gap: spacing[2],
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.success,
    },
    statusText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.success,
        letterSpacing: 0.5,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        marginTop: spacing[4],
    },
    timerBox: {
        width: 64,
        height: 64,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...shadows.sm,
    },
    timerValue: {
        fontFamily: fontFamilies.extraBold,
        fontSize: fontSizes['2xl'],
        color: colors.primary,
    },
    timerLabel: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: -spacing[1],
    },
    timerSeparator: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes['2xl'],
        color: colors.borderLight,
    },
    mapContainer: {
        height: 140,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginBottom: spacing[6],
        ...shadows.sm,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    distanceBadge: {
        position: 'absolute',
        bottom: spacing[3],
        left: spacing[3],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.lg,
        gap: spacing[1],
        ...shadows.sm,
    },
    distanceText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textPrimary,
    },
    expandButton: {
        position: 'absolute',
        top: spacing[3],
        right: spacing[3],
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: spacing[2],
        borderRadius: borderRadius.full,
        ...shadows.sm,
    },
    timeline: {
        position: 'relative',
    },
    timelineStop: {
        marginBottom: spacing[4],
    },
    timelineStopInactive: {
        opacity: 0.6,
    },
    timelineHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[4],
        marginBottom: spacing[4],
    },
    timelineIconPickup: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.primary,
    },
    timelineIconDrop: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineHeaderContent: {
        flex: 1,
    },
    timelineLabel: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        letterSpacing: 0.5,
    },
    timelineSubLabel: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    timelineCard: {
        marginLeft: spacing[14],
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[4],
        borderWidth: 1,
        borderColor: colors.borderLight,
        ...shadows.sm,
    },
    timelineCardInactive: {
        opacity: 0.8,
    },
    timelineLine: {
        position: 'absolute',
        left: 19,
        top: 56,
        bottom: 80,
        width: 2,
        backgroundColor: colors.borderLight,
        borderStyle: 'dotted',
    },
    shopHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing[3],
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
        marginTop: spacing[1],
    },
    shopLogo: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.borderLight,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    navigateButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: spacing[2.5],
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
    },
    navigateButtonInactive: {
        backgroundColor: colors.borderLight,
    },
    navigateText: {
        fontFamily: fontFamilies.semiBold,
        fontSize: fontSizes.base,
        color: colors.white,
    },
    callButton: {
        width: 48,
        backgroundColor: colors.borderLight,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemsSection: {
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingTop: spacing[3],
    },
    itemsHeader: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        letterSpacing: 0.5,
        marginBottom: spacing[3],
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing[3],
        marginBottom: spacing[3],
    },
    itemIcon: {
        padding: spacing[1.5],
        borderRadius: borderRadius.lg,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontFamily: fontFamilies.semiBold,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
    },
    itemPrice: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: spacing[0.5],
    },
    itemQuantity: {
        backgroundColor: colors.borderLight,
        paddingHorizontal: spacing[1.5],
        paddingVertical: spacing[0.5],
        borderRadius: borderRadius.sm,
    },
    quantityText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textSecondary,
    },
    paymentBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.textPrimary,
        borderRadius: borderRadius.xl,
        padding: spacing[4],
        marginTop: spacing[6],
    },
    paymentIcon: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: spacing[2],
        borderRadius: borderRadius.lg,
    },
    paymentInfo: {
        flex: 1,
        marginLeft: spacing[3],
    },
    paymentMethod: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.white,
    },
    paymentSubtext: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        color: 'rgba(255,255,255,0.6)',
    },
    paymentAmount: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xl,
        color: colors.white,
    },
    bottomAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        padding: spacing[4],
        paddingBottom: spacing[8],
    },
    swipeContainer: {
        height: 56,
        backgroundColor: colors.borderLight,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
    swipeTextContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    swipeText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textMuted,
        marginRight: spacing[1],
    },
    swipeKnob: {
        position: 'absolute',
        left: spacing[1],
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.lg,
    },
});
