import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../src/theme/colors';
import { fontFamilies, fontSizes } from '../src/theme/typography';
import { borderRadius, shadows, spacing } from '../src/theme/spacing';

const { width, height } = Dimensions.get('window');

export default function NavigationScreen() {
    return (
        <View style={styles.container}>
            {/* Full Screen Map */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200' }}
                    style={styles.mapImage}
                />

                {/* Route Overlay (simulated) */}
                <View style={styles.routeOverlay}>
                    <View style={styles.destinationMarker}>
                        <View style={styles.destinationDot} />
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.currentLocation}>
                        <View style={styles.currentLocationOuter}>
                            <View style={styles.currentLocationInner} />
                        </View>
                    </View>
                </View>
            </View>

            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.statusPill}>
                    <View style={styles.statusSection}>
                        <Text style={styles.statusLabel}>PICKUP IN</Text>
                        <Text style={styles.statusValue}>12 min</Text>
                    </View>
                    <View style={styles.statusDivider} />
                    <View style={styles.statusSection}>
                        <Text style={styles.statusLabel}>DISTANCE</Text>
                        <Text style={styles.statusValueDark}>3.2 km</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.sosButton}>
                    <Ionicons name="headset" size={24} color="#dc2626" />
                </TouchableOpacity>
            </View>

            {/* Floating Action Buttons */}
            <View style={styles.floatingButtons}>
                <TouchableOpacity style={styles.floatingButton}>
                    <Ionicons name="locate" size={24} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.floatingButton}>
                    <Ionicons name="layers" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <View style={styles.dragHandle} />

                <View style={styles.sheetContent}>
                    {/* Shop Info */}
                    <View style={styles.shopInfoHeader}>
                        <View>
                            <Text style={styles.pickupLabel}>PICKUP AT SHOP</Text>
                            <Text style={styles.shopName}>Varthur Fresh Cuts</Text>
                        </View>
                        <View style={styles.prepaidBadge}>
                            <Text style={styles.prepaidText}>Prepaid</Text>
                        </View>
                    </View>
                    <View style={styles.addressRow}>
                        <Ionicons name="storefront-outline" size={18} color={colors.textMuted} />
                        <Text style={styles.addressText} numberOfLines={1}>
                            Shop #4, Main Road, Near Varthur Lake
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionGrid}>
                        <TouchableOpacity style={styles.navigateButton}>
                            <Ionicons name="navigate" size={20} color={colors.white} />
                            <Text style={styles.navigateText}>Start Navigation</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.callButton}>
                            <Ionicons name="call" size={20} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Order Info */}
                    <View style={styles.orderInfo}>
                        <View style={styles.orderIcon}>
                            <Ionicons name="receipt" size={20} color={colors.primary} />
                        </View>
                        <View style={styles.orderDetails}>
                            <Text style={styles.orderId}>ORDER #4421</Text>
                            <Text style={styles.orderItems}>1kg Chicken Curry Cut + 2 more</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewButton}>View</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Swipe to Arrive */}
                    <View style={styles.swipeContainer}>
                        <View style={styles.swipeTextContainer}>
                            <Text style={styles.swipeText}>SLIDE TO ARRIVE</Text>
                        </View>
                        <View style={styles.swipeKnob}>
                            <Ionicons name="chevron-forward" size={24} color={colors.white} />
                        </View>
                    </View>

                    <Text style={styles.safetyNote}>
                        Ensure you are wearing your safety gear.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    mapImage: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    routeOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    destinationMarker: {
        position: 'absolute',
        top: '35%',
    },
    destinationDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        borderWidth: 4,
        borderColor: colors.white,
    },
    routeLine: {
        width: 4,
        height: 150,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    currentLocation: {
        position: 'absolute',
        bottom: '40%',
    },
    currentLocationOuter: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(244, 89, 37, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentLocationInner: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.white,
        borderWidth: 4,
        borderColor: colors.primary,
    },
    topHeader: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing[4],
    },
    backButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    statusPill: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingHorizontal: spacing[5],
        paddingVertical: spacing[2.5],
        borderRadius: borderRadius.full,
        ...shadows.md,
    },
    statusSection: {
        alignItems: 'center',
    },
    statusLabel: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        letterSpacing: 0.5,
    },
    statusValue: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.primary,
    },
    statusValueDark: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
    },
    statusDivider: {
        width: 1,
        height: 32,
        backgroundColor: colors.borderLight,
        marginHorizontal: spacing[4],
    },
    sosButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fecaca',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    floatingButtons: {
        position: 'absolute',
        right: spacing[4],
        bottom: 420,
        gap: spacing[3],
    },
    floatingButton: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.md,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.white,
        borderTopLeftRadius: borderRadius['2xl'],
        borderTopRightRadius: borderRadius['2xl'],
        ...shadows.xl,
        maxHeight: '55%',
    },
    dragHandle: {
        width: 48,
        height: 6,
        backgroundColor: colors.borderLight,
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: spacing[3],
        marginBottom: spacing[2],
    },
    sheetContent: {
        paddingHorizontal: spacing[5],
        paddingBottom: spacing[6],
    },
    shopInfoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing[2],
    },
    pickupLabel: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.sm,
        color: colors.primary,
        letterSpacing: 0.5,
        marginBottom: spacing[1],
    },
    shopName: {
        fontFamily: fontFamilies.extraBold,
        fontSize: fontSizes['2xl'],
        color: colors.textPrimary,
    },
    prepaidBadge: {
        backgroundColor: colors.successLight,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    prepaidText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.success,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1.5],
        marginBottom: spacing[5],
    },
    addressText: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        flex: 1,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: spacing[3],
        marginBottom: spacing[5],
    },
    navigateButton: {
        flex: 3,
        flexDirection: 'row',
        backgroundColor: '#2563eb',
        height: 48,
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        ...shadows.md,
    },
    navigateText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.md,
        color: colors.white,
    },
    callButton: {
        flex: 1,
        height: 48,
        backgroundColor: colors.borderLight,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: colors.borderLight,
        marginBottom: spacing[5],
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        borderRadius: borderRadius.xl,
        padding: spacing[3],
        borderWidth: 1,
        borderColor: colors.borderLight,
        marginBottom: spacing[5],
    },
    orderIcon: {
        width: 40,
        height: 40,
        backgroundColor: colors.white,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    orderDetails: {
        flex: 1,
        marginLeft: spacing[3],
    },
    orderId: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        letterSpacing: 0.5,
    },
    orderItems: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
    },
    viewButton: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.primary,
    },
    swipeContainer: {
        height: 56,
        backgroundColor: colors.borderLight,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing[4],
    },
    swipeTextContainer: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 50,
    },
    swipeText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.sm,
        color: colors.textMuted,
        letterSpacing: 2,
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
    safetyNote: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        textAlign: 'center',
    },
});
