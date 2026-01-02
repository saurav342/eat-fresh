import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { fontFamilies, fontSizes } from '../../src/theme/typography';
import { borderRadius, shadows, spacing } from '../../src/theme/spacing';

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }}
                        style={styles.avatar}
                    />
                    <View style={styles.editBadge}>
                        <Ionicons name="camera" size={16} color={colors.white} />
                    </View>
                </View>
                <Text style={styles.name}>Rahul Kumar</Text>
                <Text style={styles.phone}>+91 98765 43210</Text>

                <View style={styles.menuList}>
                    {[
                        { icon: 'person-outline', label: 'Personal Details' },
                        { icon: 'document-text-outline', label: 'Documents' },
                        { icon: 'card-outline', label: 'Bank Details' },
                        { icon: 'settings-outline', label: 'Settings' },
                        { icon: 'help-circle-outline', label: 'Help & Support' },
                        { icon: 'log-out-outline', label: 'Logout', danger: true },
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.menuItem}>
                            <Ionicons
                                name={item.icon as any}
                                size={24}
                                color={item.danger ? colors.error : colors.textPrimary}
                            />
                            <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                                {item.label}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                        </TouchableOpacity>
                    ))}
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
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xl,
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: spacing[8],
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing[4],
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: colors.white,
        ...shadows.md,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.background,
    },
    name: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xl,
        color: colors.textPrimary,
    },
    phone: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        marginTop: spacing[1],
    },
    menuList: {
        width: '100%',
        marginTop: spacing[8],
        paddingHorizontal: spacing[4],
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
        borderRadius: borderRadius.xl,
        marginBottom: spacing[2],
        ...shadows.sm,
    },
    menuLabel: {
        flex: 1,
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
        marginLeft: spacing[3],
    },
    menuLabelDanger: {
        color: colors.error,
    },
});
