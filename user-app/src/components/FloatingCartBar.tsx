import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface FloatingCartBarProps {
    itemCount: number;
    total: number;
    onPress: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
    itemCount,
    total,
    onPress,
}) => {
    if (itemCount === 0) return null;

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
                <View style={styles.leftContent}>
                    <Text style={styles.itemsLabel}>
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'} added
                    </Text>
                    <Text style={styles.total}>₹{total}</Text>
                </View>
                <View style={styles.rightContent}>
                    <Text style={styles.viewCartText}>View Cart</Text>
                    <MaterialIcons name="arrow-forward" size={20} color={colors.textPrimary} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing[4],
        paddingBottom: spacing[8],
        zIndex: 40,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        padding: spacing[3],
        paddingHorizontal: spacing[4],
        ...shadows.xl,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
    },
    leftContent: {
        flexDirection: 'column',
    },
    itemsLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        color: 'rgba(13, 28, 19, 0.7)',
    },
    total: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
    },
    viewCartText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
    },
});

export default FloatingCartBar;
