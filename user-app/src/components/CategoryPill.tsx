import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../theme';
import { Category } from '../types';

interface CategoryPillProps {
    category: Category;
    onPress: () => void;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ category, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.imageWrapper}>
                <Image source={{ uri: category.image }} style={styles.image} />
            </View>
            <Text style={styles.label}>{category.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: spacing[2],
    },
    imageWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primaryLight,
        padding: spacing[1],
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default CategoryPill;
