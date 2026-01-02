import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface QuantitySelectorProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    size?: 'small' | 'medium' | 'large';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    onIncrement,
    onDecrement,
    size = 'medium',
}) => {
    const sizeStyles = {
        small: {
            container: { height: 32, minWidth: 80, padding: spacing[0.5] },
            button: { width: 24, height: 24, borderRadius: 6 },
            icon: 14,
            text: { fontSize: 12, width: 20 },
        },
        medium: {
            container: { height: 40, minWidth: 100, padding: spacing[1] },
            button: { width: 32, height: 32, borderRadius: 8 },
            icon: 18,
            text: { fontSize: 14, width: 28 },
        },
        large: {
            container: { height: 56, minWidth: 120, padding: spacing[2] },
            button: { width: 40, height: 40, borderRadius: borderRadius.lg },
            icon: 20,
            text: { fontSize: 18, width: 40 },
        },
    };

    const currentSize = sizeStyles[size];

    return (
        <View style={[styles.container, currentSize.container]}>
            <TouchableOpacity
                style={[styles.button, styles.decrementButton, currentSize.button]}
                onPress={onDecrement}
                activeOpacity={0.7}
            >
                <MaterialIcons name="remove" size={currentSize.icon} color={colors.primary} />
            </TouchableOpacity>

            <Text style={[styles.quantity, currentSize.text]}>{quantity}</Text>

            <TouchableOpacity
                style={[styles.button, styles.incrementButton, currentSize.button]}
                onPress={onIncrement}
                activeOpacity={0.7}
            >
                <MaterialIcons name="add" size={currentSize.icon} color={colors.white} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.white,
        borderRadius: borderRadius.DEFAULT,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    decrementButton: {
        backgroundColor: colors.white,
    },
    incrementButton: {
        backgroundColor: colors.primary,
    },
    quantity: {
        fontWeight: '700',
        color: colors.textPrimary,
        textAlign: 'center',
    },
});

export default QuantitySelector;
