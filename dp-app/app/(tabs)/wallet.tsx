import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { fontFamilies, fontSizes } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

export default function WalletScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <Ionicons name="wallet-outline" size={64} color={colors.textMuted} />
                <Text style={styles.title}>Wallet</Text>
                <Text style={styles.subtitle}>Your earnings and payouts will appear here</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing[8],
    },
    title: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xl,
        color: colors.textPrimary,
        marginTop: spacing[4],
    },
    subtitle: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing[2],
    },
});
