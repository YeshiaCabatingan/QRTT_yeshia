import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/lib/auth';
import { registerAttendance } from '@/lib/attendance';


import Ionicons from '@expo/vector-icons/Ionicons';
import AppButton from '@/components/AppButton';
import { CornerReticle } from '@/components/TechDecor';
import type { Theme } from '@/constants/theme';
import { useTheme, useThemedStyles } from '@/lib/theme';

export default function ScanScreen() {
  const { user } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastData, setLastData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);


  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionIcon}>
          <Ionicons name="camera-outline" size={40} color={theme.primary} />
        </View>
        <Text style={styles.title}>Camera Permission Needed</Text>
        <Text style={styles.subtitle}>
          We need access to your camera to scan QR codes.
        </Text>
        <AppButton
          theme="primary"
          title="Grant Permission"
          icon="camera"
          onPress={requestPermission}
        />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);
    setLastData(data);
    setMessage('Checking QR code...');
    setSuccess(false);

    const studentId = user?.id ?? 'unknown';
    registerAttendance(data, studentId)
      .then((result) => {
        setMessage(result.message || 'not QR event code');
        setSuccess(result.success);
      })
      .catch(() => {
        setMessage('not QR event code');
        setSuccess(false);
      });
  };

  const handleScanAgain = () => {
    setScanned(false);
    setLastData(null);
    setMessage(null);
    setSuccess(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.reticleLayer}>
        <CornerReticle size={236} />
      </View>

      <View style={styles.overlay}>
        <View style={styles.overlayHeader}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: !scanned ? theme.primary : success ? theme.success : theme.danger },
            ]}
          />
          <Text style={styles.overlayText}>
            {scanned ? 'QR Code detected!' : 'Point your camera at a QR code'}
          </Text>
        </View>

        {scanned && message && (
          <Text style={[styles.scanResult, success ? styles.success : styles.error]}>
            {message}
          </Text>
        )}

        {scanned && lastData && (
          <Text style={styles.scanData}>{lastData}</Text>
        )}

        {scanned && (
          <AppButton
            theme="primary"
            title="Scan Again"
            icon="refresh"
            onPress={handleScanAgain}
          />
        )}
      </View>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    camera: {
      ...StyleSheet.absoluteFillObject,
    },
    permissionIcon: {
      width: 92,
      height: 92,
      borderRadius: 46,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 16,
    },
    reticleLayer: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    },
    overlay: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 60,
      backgroundColor: theme.card,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16,
      alignItems: 'center',
      overflow: 'hidden',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: theme.mode === 'dark' ? 0.5 : 0.18,
      shadowRadius: 14,
      elevation: 8,
    },
    overlayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    overlayText: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    checking: {
      marginVertical: 8,
    },
    scanResult: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 8,
      fontWeight: '600',
    },
    success: { color: theme.success },
    error: { color: theme.danger },
    scanData: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 12,
      fontFamily: 'monospace',
    },
  });