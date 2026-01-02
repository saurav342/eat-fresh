import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { fontFamilies, fontSizes } from '../../src/theme/typography';
import { borderRadius, shadows, spacing } from '../../src/theme/spacing';

type VehicleType = 'bike' | 'scooter' | 'ev';

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [vehicleType, setVehicleType] = useState<VehicleType>('bike');
    const [vehicleNumber, setVehicleNumber] = useState('');

    const handleRegister = () => {
        // TODO: Implement registration
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Partner Registration</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' }}
                        style={styles.heroImage}
                    />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroLocation}>
                        <Ionicons name="location" size={18} color={colors.primary} />
                        <Text style={styles.locationText}>Varthur, Bangalore</Text>
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>
                    Let's get you{'\n'}
                    <Text style={styles.titleHighlight}>on the road!</Text>
                </Text>
                <Text style={styles.subtitle}>
                    Start delivering fresh cuts and earn up to{' '}
                    <Text style={styles.subtitleBold}>₹30,000/month</Text>. Shifts available 8 AM - 8 PM.
                </Text>

                {/* Section 1: Personal Details */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionNumber}>
                            <Text style={styles.sectionNumberText}>1</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Personal Details</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Rahul Kumar"
                                placeholderTextColor={colors.textMuted}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Phone Number</Text>
                        <View style={styles.phoneInputWrapper}>
                            <View style={styles.phonePrefix}>
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
                            {phoneNumber.length >= 10 && (
                                <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.verifiedIcon} />
                            )}
                        </View>
                        {phoneNumber.length >= 10 && (
                            <View style={styles.verifiedBadge}>
                                <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                                <Text style={styles.verifiedText}>Verified via OTP</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Section 2: Vehicle Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionNumber}>
                            <Text style={styles.sectionNumberText}>2</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Your Ride</Text>
                    </View>

                    <View style={styles.vehicleGrid}>
                        {[
                            { type: 'bike', icon: 'bicycle', label: 'Bike' },
                            { type: 'scooter', icon: 'speedometer-outline', label: 'Scooter' },
                            { type: 'ev', icon: 'flash-outline', label: 'EV' },
                        ].map((vehicle) => (
                            <TouchableOpacity
                                key={vehicle.type}
                                style={[
                                    styles.vehicleOption,
                                    vehicleType === vehicle.type && styles.vehicleOptionActive,
                                ]}
                                onPress={() => setVehicleType(vehicle.type as VehicleType)}
                            >
                                <Ionicons
                                    name={vehicle.icon as any}
                                    size={32}
                                    color={vehicleType === vehicle.type ? colors.primary : colors.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.vehicleLabel,
                                        vehicleType === vehicle.type && styles.vehicleLabelActive,
                                    ]}
                                >
                                    {vehicle.label}
                                </Text>
                                {vehicleType === vehicle.type && (
                                    <View style={styles.vehicleCheck}>
                                        <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Vehicle Number Plate</Text>
                        <TextInput
                            style={[styles.input, styles.vehicleInput]}
                            placeholder="KA 03 AB 1234"
                            placeholderTextColor={colors.textMuted}
                            value={vehicleNumber}
                            onChangeText={(text) => setVehicleNumber(text.toUpperCase())}
                            autoCapitalize="characters"
                        />
                    </View>
                </View>

                {/* Section 3: Documents */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionNumber}>
                            <Text style={styles.sectionNumberText}>3</Text>
                        </View>
                        <Text style={styles.sectionTitle}>Documents</Text>
                    </View>

                    <TouchableOpacity style={styles.uploadCard}>
                        <View style={[styles.uploadIcon, { backgroundColor: colors.primaryMuted }]}>
                            <Ionicons name="card-outline" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.uploadContent}>
                            <Text style={styles.uploadTitle}>Driver's License</Text>
                            <Text style={styles.uploadSubtitle}>Upload front & back side</Text>
                        </View>
                        <TouchableOpacity style={styles.uploadButton}>
                            <Text style={styles.uploadButtonText}>Upload</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.uploadCard}>
                        <View style={styles.uploadIcon}>
                            <Ionicons name="car-outline" size={24} color={colors.textMuted} />
                        </View>
                        <View style={styles.uploadContent}>
                            <Text style={styles.uploadTitle}>RC Book / Card</Text>
                            <Text style={styles.uploadSubtitle}>Vehicle registration certificate</Text>
                        </View>
                        <TouchableOpacity style={[styles.uploadButton, styles.uploadButtonSecondary]}>
                            <Text style={[styles.uploadButtonText, styles.uploadButtonTextSecondary]}>Upload</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Fixed Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Register & Start Earning</Text>
                    <Ionicons name="arrow-forward" size={20} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.termsText}>
                    By registering, you agree to our <Text style={styles.termsLink}>Terms</Text> &{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
        textAlign: 'center',
        marginRight: 40,
    },
    progressContainer: {
        height: 4,
        backgroundColor: colors.borderLight,
    },
    progressBar: {
        width: '33%',
        height: '100%',
        backgroundColor: colors.primary,
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing[5],
        paddingTop: spacing[4],
    },
    heroContainer: {
        height: 160,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginBottom: spacing[5],
        ...shadows.lg,
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.textMuted,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    heroLocation: {
        position: 'absolute',
        bottom: spacing[4],
        left: spacing[4],
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
    },
    locationText: {
        fontFamily: fontFamilies.semiBold,
        fontSize: fontSizes.base,
        color: colors.white,
    },
    title: {
        fontFamily: fontFamilies.extraBold,
        fontSize: 30,
        color: colors.textPrimary,
        lineHeight: 36,
        marginBottom: spacing[2],
    },
    titleHighlight: {
        color: colors.primary,
    },
    subtitle: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: spacing[8],
    },
    subtitleBold: {
        fontFamily: fontFamilies.bold,
        color: colors.textPrimary,
    },
    section: {
        marginBottom: spacing[8],
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    sectionNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primaryMuted,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionNumberText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.primary,
    },
    sectionTitle: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
    },
    inputGroup: {
        marginBottom: spacing[4],
    },
    inputLabel: {
        fontFamily: fontFamilies.semiBold,
        fontSize: fontSizes.base,
        color: colors.textSecondary,
        marginBottom: spacing[1.5],
        marginLeft: spacing[1],
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        ...shadows.sm,
    },
    inputIcon: {
        marginLeft: spacing[4],
    },
    input: {
        flex: 1,
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[3.5],
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        ...shadows.sm,
    },
    phonePrefix: {
        paddingHorizontal: spacing[4],
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
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3.5],
    },
    verifiedIcon: {
        marginRight: spacing[4],
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing[1],
        marginTop: spacing[1],
        marginLeft: spacing[1],
    },
    verifiedText: {
        fontFamily: fontFamilies.medium,
        fontSize: fontSizes.xs,
        color: colors.success,
    },
    vehicleGrid: {
        flexDirection: 'row',
        gap: spacing[3],
        marginBottom: spacing[4],
    },
    vehicleOption: {
        flex: 1,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        paddingVertical: spacing[4],
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    vehicleOptionActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    vehicleLabel: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: spacing[2],
    },
    vehicleLabelActive: {
        color: colors.primary,
    },
    vehicleCheck: {
        position: 'absolute',
        top: spacing[2],
        right: spacing[2],
    },
    vehicleInput: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing[4],
        fontFamily: fontFamilies.medium,
        letterSpacing: 2,
        ...shadows.sm,
    },
    uploadCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        padding: spacing[4],
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: colors.borderLight,
        marginBottom: spacing[3],
    },
    uploadIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadContent: {
        flex: 1,
        marginLeft: spacing[4],
    },
    uploadTitle: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.base,
        color: colors.textPrimary,
    },
    uploadSubtitle: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: spacing[0.5],
    },
    uploadButton: {
        backgroundColor: colors.primaryMuted,
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[1.5],
        borderRadius: borderRadius.lg,
    },
    uploadButtonSecondary: {
        backgroundColor: '#f1f1f1',
    },
    uploadButtonText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.xs,
        color: colors.primary,
    },
    uploadButtonTextSecondary: {
        color: colors.textSecondary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(248, 246, 245, 0.95)',
        paddingHorizontal: spacing[4],
        paddingTop: spacing[4],
        paddingBottom: spacing[8],
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    registerButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: spacing[4],
        borderRadius: borderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing[2],
        ...shadows.primary,
    },
    registerButtonText: {
        fontFamily: fontFamilies.bold,
        fontSize: fontSizes.lg,
        color: colors.white,
    },
    termsText: {
        fontFamily: fontFamilies.regular,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing[3],
    },
    termsLink: {
        textDecorationLine: 'underline',
    },
});
