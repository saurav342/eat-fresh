import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { Product } from '../types';
import QuantitySelector from './QuantitySelector';

interface ProductCardProps {
    product: Product;
    quantity: number;
    onAdd: () => void;
    onUpdateQuantity: (quantity: number) => void;
    onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    quantity,
    onAdd,
    onUpdateQuantity,
    onPress,
}) => {
    const hasDiscount = product.originalPrice && product.discount;
    const isSoldOut = !product.isAvailable;
    const isBestseller = product.tags.includes('Bestseller');

    return (
        <TouchableOpacity
            style={[styles.container, isSoldOut && styles.soldOutContainer]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={isSoldOut}
        >
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: product.image }}
                    style={[styles.image, isSoldOut && styles.soldOutImage]}
                />
                {isBestseller && !isSoldOut && (
                    <View style={styles.bestsellerBadge}>
                        <Text style={styles.bestsellerText}>BESTSELLER</Text>
                    </View>
                )}
                {isSoldOut && (
                    <View style={styles.soldOutOverlay}>
                        <View style={styles.soldOutBadge}>
                            <Text style={styles.soldOutBadgeText}>SOLD OUT</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Product Info */}
            <View style={[styles.infoContainer, isSoldOut && styles.soldOutInfo]}>
                <Text style={styles.name} numberOfLines={2}>
                    {product.name}
                </Text>
                <Text style={styles.weight}>
                    {product.weight} {product.features?.[0] && `• ${product.features[0]}`}
                </Text>

                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        {hasDiscount && (
                            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                        )}
                        <Text style={styles.price}>₹{product.price}</Text>
                    </View>

                    {isSoldOut ? (
                        <TouchableOpacity style={styles.soldOutButton} disabled>
                            <Text style={styles.soldOutButtonText}>ADD</Text>
                        </TouchableOpacity>
                    ) : quantity > 0 ? (
                        <QuantitySelector
                            quantity={quantity}
                            onDecrement={() => onUpdateQuantity(quantity - 1)}
                            onIncrement={() => onUpdateQuantity(quantity + 1)}
                            size="small"
                        />
                    ) : (
                        <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                            <Text style={styles.addButtonText}>ADD</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    soldOutContainer: {
        opacity: 0.9,
    },
    imageContainer: {
        height: 144,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    soldOutImage: {
        opacity: 0.5,
    },
    bestsellerBadge: {
        position: 'absolute',
        top: spacing[2],
        left: spacing[2],
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.DEFAULT,
        ...shadows.sm,
    },
    bestsellerText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    soldOutOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    soldOutBadge: {
        backgroundColor: colors.textPrimary,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.DEFAULT,
    },
    soldOutBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.white,
    },
    infoContainer: {
        padding: spacing[3],
        flex: 1,
    },
    soldOutInfo: {
        opacity: 0.6,
    },
    name: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        lineHeight: 18,
    },
    weight: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 'auto',
        paddingTop: spacing[3],
    },
    priceContainer: {
        flexDirection: 'column',
    },
    originalPrice: {
        fontSize: 12,
        color: colors.textSecondary,
        textDecorationLine: 'line-through',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    addButton: {
        height: 32,
        minWidth: 70,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    addButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    soldOutButton: {
        height: 32,
        minWidth: 70,
        backgroundColor: colors.borderLight,
        borderRadius: borderRadius.DEFAULT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    soldOutButtonText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textSecondary,
    },
});

export default ProductCard;
