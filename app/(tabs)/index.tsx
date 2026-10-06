import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import Header from '@/components/Header';
import { GridBackdrop } from '@/components/TechDecor';
import type { Theme } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/lib/theme';

export default function Index() {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <SafeAreaView style={styles.container}>
      <GridBackdrop cell={48} />

      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.push('/appearance')}
          style={({ pressed }) => [styles.customize, pressed && styles.customizePressed]}
        >
          <Ionicons name="color-palette-outline" size={16} color={theme.primary} />
          <Text style={styles.customizeText}>Customize</Text>
        </Pressable>
      </View>

      <View style={styles.headerContainer}>
        <Header title="QR Attendance" />
      </View>

      <View style={styles.bodyContainer}>
        <Card accent style={styles.hero}>
          <Text style={styles.mainTitle}>School Event Attendance</Text>
          <Text style={styles.subtitle}>
            Scan QR Codes to record attendance during school activities.
          </Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: theme.success }]} />
            <Text style={styles.statusText}>SYSTEM READY</Text>
            <Text style={styles.versionText}>v1.0 · QR-ATT</Text>
          </View>
        </Card>
      </View>

      <View style={styles.footerContainer}>
        <AppButton
          theme="primary"
          title="Scan QR Code"
          icon="qr-code-outline"
          onPress={() => router.push('/scan')}
        />
        <AppButton
          title="Attendance History"
          icon="time-outline"
          onPress={() => router.push('/history')}
        />
        <AppButton
          title="Profile"
          icon="person-outline"
          onPress={() => router.push('/profile')}
        />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    topBar: {
      alignItems: 'flex-end',
      paddingHorizontal: 24,
      paddingTop: 6,
      zIndex: 2,
    },
    customize: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primaryTint,
      borderRadius: theme.radius.chip,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    customizePressed: {
      opacity: 0.75,
      transform: [{ scale: 0.97 }],
    },
    customizeText: {
      color: theme.primary,
      fontSize: 13,
      fontWeight: '700',
      marginLeft: 6,
    },
    headerContainer: { flex: 0.5, justifyContent: 'center' },
    bodyContainer: { paddingHorizontal: 24, marginBottom: 16 },
    hero: {
      marginTop: 4,
    },
    mainTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 6,
    },
    subtitle: { fontSize: 15, color: theme.textSecondary, lineHeight: 21 },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    statusText: {
      flex: 1,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1,
      color: theme.textSecondary,
      fontFamily: 'monospace',
    },
    versionText: {
      fontSize: 11,
      color: theme.textSecondary,
      fontFamily: 'monospace',
      opacity: 0.8,
    },
    footerContainer: {
      flex: 0.8,
      paddingHorizontal: 24,
      width: '100%',
      justifyContent: 'flex-end',
      paddingBottom: 24,
    },
  });
