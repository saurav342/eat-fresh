import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing } from '../../src/theme';

export default function Items() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialIcons name="category" size={80} color={colors.borderLight} />
                <Text style={styles.title}>Browse Items</Text>
                <Text style={styles.subtitle}>Coming soon!</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing[8],
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginTop: spacing[4],
    },
    subtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing[2],
    },
});
