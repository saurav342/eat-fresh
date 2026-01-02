import { StyleSheet } from 'react-native';
import colors from './colors';

export const fontFamilies = {
    regular: 'PlusJakartaSans_400Regular',
    medium: 'PlusJakartaSans_500Medium',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
    extraBold: 'PlusJakartaSans_800ExtraBold',
};

export const fontSizes = {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
};

export const lineHeights = {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
};

export const typography = StyleSheet.create({
    // Headings
    h1: {
        fontFamily: fontFamilies.extraBold,
        fontSize: fontSizes['4xl'],
        lineHeight: fontSizes['4xl'] * lineHeights.tight,
        color: colors.textPrimary,
    },
    h2: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xl,
        lineHeight: fontSizes.xl * lineHeights.snug,
        color: colors.textPrimary,
    },
    h3: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        lineHeight: fontSizes.lg * lineHeights.snug,
        color: colors.textPrimary,
    },

    // Body text
    body: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.base,
        lineHeight: fontSizes.base * lineHeights.relaxed,
        color: colors.textPrimary,
    },
    bodyBold: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        lineHeight: fontSizes.base * lineHeights.normal,
        color: colors.textPrimary,
    },
    bodySmall: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.sm,
        lineHeight: fontSizes.sm * lineHeights.normal,
        color: colors.textSecondary,
    },

    // Labels
    label: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: colors.textSecondary,
    },
    labelSmall: {
        fontFamily: fontFamilies.bold,
        fontSize: 9,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        color: colors.textSecondary,
    },

    // Buttons
    button: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.md,
        color: colors.white,
    },
    buttonSmall: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.sm,
        color: colors.white,
    },

    // Price / Earnings
    price: {
        fontFamily: fontFamilies.extraBold,
        fontSize: fontSizes['2xl'],
        color: colors.textPrimary,
    },
    priceSmall: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
    },
});

export default typography;
