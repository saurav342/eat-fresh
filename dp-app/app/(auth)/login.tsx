import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { fontFamilies, fontSizes } from '../../src/theme/typography';
import { borderRadius, shadows, spacing } from '../../src/theme/spacing';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleLogin = () => {
        // TODO: Implement actual login
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Top App Bar */}
                <View style={styles.topBar}>
                    <Text style={styles.appTitle}>Partner App</Text>
                    <TouchableOpacity style={styles.languageButton}>
                        <Ionicons name="language" size={18} color={colors.primary} />
                        <Text style={styles.languageText}>Eng/Kan</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContent}>
                        <View style={styles.locationBadge}>
                            <Text style={styles.locationText}>VARTHUR AREA</Text>
                        </View>
                        <Text style={styles.heroTitle}>Drive with Us</Text>
                        <Text style={styles.heroSubtitle}>Earn up to ₹30,000/month</Text>
                    </View>
                </View>

                {/* Headline */}
                <View style={styles.headlineContainer}>
                    <Text style={styles.headline}>Deliver fresh cuts & earn daily</Text>
                    <Text style={styles.subheadline}>
                        Join Bangalore's fastest growing meat delivery network.
                    </Text>
                </View>

                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'login' && styles.tabActive]}
                        onPress={() => setActiveTab('login')}
                    >
                        <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                            Login
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'register' && styles.tabActive]}
                        onPress={() => {
                            setActiveTab('register');
                            router.push('/(auth)/register');
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
                            Register
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Phone Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <View style={styles.phoneInputWrapper}>
                        <View style={styles.phonePrefix}>
                            <Ionicons name="phone-portrait-outline" size={20} color={colors.textMuted} />
                            <Text style={styles.countryCode}>+91</Text>
                        </View>
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="98765 43210"
                            placeholderTextColor={colors.textMuted}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotContainer}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Secure Login</Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.white} />
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
                        <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Ionicons name="logo-apple" size={20} color={colors.textPrimary} />
                        <Text style={styles.socialButtonText}>Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Support */}
                <TouchableOpacity style={styles.supportContainer}>
                    <Ionicons name="headset" size={18} color={colors.primary} />
                    <Text style={styles.supportText}>Need Help? Call Support</Text>
                </TouchableOpacity>

                {/* Legal */}
                <Text style={styles.legalText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.legalLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.legalLink}>Privacy Policy</Text>.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing[4],
        paddingBottom: spacing[8],
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing[4],
    },
    appTitle: {
        fontFamily: fontFamilies.extraBold,
        fontSize: fontSizes.xl,
        color: colors.textPrimary,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
        gap: spacing[1],
        ...shadows.sm,
    },
    languageText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.primary,
    },
    heroContainer: {
        height: 220,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginBottom: spacing[6],
        ...shadows.md,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.textMuted,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    heroContent: {
        position: 'absolute',
        bottom: spacing[5],
        left: spacing[5],
    },
    locationBadge: {
        backgroundColor: 'rgba(244, 89, 37, 0.9)',
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1],
        borderRadius: borderRadius.lg,
        alignSelf: 'flex-start',
        marginBottom: spacing[2],
    },
    locationText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.white,
        letterSpacing: 1,
    },
    heroTitle: {
        fontFamily: fontFamilies.extraBold,
        fontSize: 28,
        color: colors.white,
    },
    heroSubtitle: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.base,
        color: 'rgba(255,255,255,0.9)',
        marginTop: spacing[1],
    },
    headlineContainer: {
        alignItems: 'center',
        marginBottom: spacing[6],
    },
    headline: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes['2xl'],
        color: colors.textPrimary,
        textAlign: 'center',
    },
    subheadline: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        marginTop: spacing[2],
        textAlign: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f1f1',
        borderRadius: borderRadius.xl,
        padding: spacing[1],
        marginBottom: spacing[6],
    },
    tab: {
        flex: 1,
        paddingVertical: spacing[3],
        alignItems: 'center',
        borderRadius: borderRadius.lg,
    },
    tabActive: {
        backgroundColor: colors.white,
        ...shadows.sm,
    },
    tabText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.primary,
    },
    inputContainer: {
        marginBottom: spacing[4],
    },
    inputLabel: {
        fontFamily: fontFamilies.semiBold,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
        marginBottom: spacing[2],
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.sm,
    },
    phonePrefix: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        gap: spacing[2],
        borderRightWidth: 1,
        borderRightColor: colors.borderLight,
    },
    countryCode: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.md,
        color: colors.textSecondary,
    },
    phoneInput: {
        flex: 1,
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[4],
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: spacing[6],
    },
    forgotText: {
        fontFamily: fontFamilies.semiBold,
        fontSize: fontSizes.base,
        color: colors.primary,
    },
    loginButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: spacing[4],
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        ...shadows.primary,
    },
    loginButtonText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.white,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: spacing[8],
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.borderLight,
    },
    dividerText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        paddingHorizontal: spacing[4],
        letterSpacing: 1,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: spacing[4],
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingVertical: spacing[3],
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    socialButtonText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
    },
    supportContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primaryMuted,
        paddingVertical: spacing[2],
        paddingHorizontal: spacing[4],
        borderRadius: borderRadius.lg,
        marginTop: spacing[8],
        gap: spacing[2],
    },
    supportText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.primary,
    },
    legalText: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing[4],
        lineHeight: 18,
    },
    legalLink: {
        textDecorationLine: 'underline',
    },
});
