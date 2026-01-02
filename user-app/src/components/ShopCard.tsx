import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { Shop } from '../types';

interface ShopCardProps {
    shop: Shop;
    onPress: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({ shop, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Shop Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: shop.image }} style={styles.image} />
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: shop.isOpen ? colors.success : colors.error },
                    ]}
                >
                    <Text style={styles.statusText}>
                        {shop.closingSoon ? 'CLOSING SOON' : shop.isOpen ? 'OPEN' : 'CLOSED'}
                    </Text>
                </View>
            </View>

            {/* Shop Info */}
            <View style={styles.infoContainer}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>
                        {shop.name}
                    </Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{shop.rating}</Text>
                        <MaterialIcons name="star" size={10} color={colors.success} />
                    </View>
                </View>

                <Text style={styles.categories} numberOfLines={1}>
                    {shop.categories.join(' • ')}
                </Text>

                <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={14} color={colors.textSecondary} />
                    <Text style={styles.locationText}>
                        {shop.distance} • {shop.address}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.timingRow}>
                        <View style={[styles.dot, { backgroundColor: shop.isOpen ? colors.success : colors.error }]} />
                        <Text
                            style={[
                                styles.timingText,
                                { color: shop.isOpen ? colors.success : colors.error },
                            ]}
                        >
                            {shop.closingSoon ? 'Closes at 8 PM' : `Open: ${shop.timing}`}
                        </Text>
                    </View>
                    <Text style={styles.deliveryText}>
                        {shop.freeDelivery ? 'Free Delivery' : `Delivery: ₹${shop.deliveryFee}`}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[4],
        gap: spacing[4],
        ...shadows.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    imageContainer: {
        width: 96,
        height: 96,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 4,
        alignItems: 'center',
    },
    statusText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: '700',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        flex: 1,
        marginRight: spacing[2],
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primaryLight,
        paddingHorizontal: spacing[1.5],
        paddingVertical: spacing[0.5],
        borderRadius: borderRadius.DEFAULT,
        gap: 2,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.success,
    },
    categories: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing[2],
        gap: spacing[1],
    },
    locationText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing[2],
        paddingTop: spacing[2],
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderStyle: 'dashed',
    },
    timingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    timingText: {
        fontSize: 10,
        fontWeight: '500',
    },
    deliveryText: {
        fontSize: 10,
        fontWeight: '600',
        color: colors.primary,
    },
});

export default ShopCard;
