import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, borderRadius, shadows, spacing } from '../theme';

const { height } = Dimensions.get('window');
const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI-sT2qhA7XZctvWQFKguDkiUDscm2j4UavEuCxBaQTJXLJ2Oe6lDzzUBl5apZYqlCv24DzGZ6mrLxbTL7QQLltWa9xU5SiMyyDr5M9kZobIYeH497RTB7woN-2VWZ_TObXlegdxXJdz8z9XqxQ8_Q_w3rW64EOgdjXoAFUWH_TC26DCN2sIZJmQTOEEj6114I4ai8LRAAvG3uO9PHyojIO4JJcTlf1eRp4j6v1Rl7jp99pnIIREkR4QoN6asvXzBZ6llE1fTlvqSk';

export default function WelcomeScreen() {
    const router = useRouter();

    const handleGetStarted = () => {
        router.replace('/(tabs)/home');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Background Blurs */}
            <View style={styles.blurTopLeft} />
            <View style={styles.blurBottomRight} />

            <SafeAreaView style={styles.content}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <ImageBackground source={{ uri: HERO_IMAGE }} style={styles.heroImage}>
                        <View style={styles.heroOverlay} />
                        {/* Hygiene Badge */}
                        <View style={styles.badge}>
                            <MaterialIcons name="verified" size={18} color={colors.primary} />
                            <Text style={styles.badgeText}>HYGIENE CHECKED</Text>
                        </View>
                    </ImageBackground>
                </View>

                {/* Content */}
                <View style={styles.bottomContent}>
                    {/* Dots Indicator */}
                    <View style={styles.dotsContainer}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>
                        Bangalore's{'\n'}
                        <Text style={styles.titleHighlight}>Freshest Catch</Text>
                    </Text>

                    {/* Location & Timing Pills */}
                    <View style={styles.pillsContainer}>
                        <View style={styles.pill}>
                            <MaterialIcons name="location-on" size={18} color={colors.primary} />
                            <Text style={styles.pillText}>VARTHUR AREA</Text>
                        </View>
                        <View style={styles.pill}>
                            <MaterialIcons name="schedule" size={18} color={colors.primary} />
                            <Text style={styles.pillText}>8 AM - 8 PM</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        Marketplace for premium Chicken, Mutton, and Fish from Varthur's best shops.
                    </Text>

                    {/* CTA Button */}
                    <TouchableOpacity style={styles.ctaButton} onPress={handleGetStarted} activeOpacity={0.9}>
                        <Text style={styles.ctaText}>Get Started</Text>
                        <MaterialIcons name="arrow-forward" size={20} color={colors.white} />
                    </TouchableOpacity>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Already have an account?{' '}
                            <Text style={styles.loginLink}>Log in</Text>
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2fcf5',
    },
    blurTopLeft: {
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: height * 0.5,
        height: height * 0.5,
        borderRadius: height * 0.25,
        backgroundColor: 'rgba(46, 189, 89, 0.1)',
    },
    blurBottomRight: {
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: height * 0.4,
        height: height * 0.4,
        borderRadius: height * 0.2,
        backgroundColor: 'rgba(46, 189, 89, 0.05)',
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing[4],
    },
    heroContainer: {
        flex: 1,
        maxHeight: height * 0.45,
        marginTop: spacing[6],
        borderRadius: 40,
        overflow: 'hidden',
        ...shadows.xl,
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
    },
    heroImage: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    badge: {
        position: 'absolute',
        top: spacing[6],
        right: spacing[6],
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        borderRadius: borderRadius.full,
        ...shadows.lg,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    bottomContent: {
        paddingTop: spacing[4],
        paddingBottom: spacing[6],
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: spacing[2],
        marginBottom: spacing[4],
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(46, 189, 89, 0.2)',
    },
    dotActive: {
        width: 32,
        backgroundColor: colors.primary,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.textPrimary,
        textAlign: 'center',
        lineHeight: 40,
        marginBottom: spacing[3],
    },
    titleHighlight: {
        color: colors.primary,
    },
    pillsContainer: {
        flexDirection: 'row',
        gap: spacing[3],
        marginBottom: spacing[6],
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[2],
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(46, 189, 89, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(46, 189, 89, 0.2)',
    },
    pillText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 26,
        paddingHorizontal: spacing[4],
        marginBottom: spacing[8],
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[3],
        width: '100%',
        backgroundColor: colors.primary,
        paddingVertical: spacing[4],
        borderRadius: borderRadius.xl,
        ...shadows.lg,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
    },
    ctaText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
    },
    loginContainer: {
        marginTop: spacing[6],
    },
    loginText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    loginLink: {
        color: colors.primary,
    },
});
