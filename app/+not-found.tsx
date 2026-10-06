import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Link, Stack, useRouter } from 'expo-router';

import type { Theme } from '@/constants/theme';
import { useThemedStyles, useTheme } from '@/lib/theme';

export default function NotFoundScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Ionicons name="cloud-offline-outline" size={44} color={theme.primary} />
        </View>
        <Text style={styles.title}>Oops! Not Found</Text>
        <Text style={styles.subtitle}>
          The page you are looking for does not exist or has moved.
        </Text>
        <Link href="/" asChild>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Go back to Home screen!</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    iconWrap: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: theme.primaryTint,
      borderWidth: 1,
      borderColor: theme.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 22,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: theme.radius.button,
      paddingHorizontal: 22,
      paddingVertical: 14,
    },
    buttonPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textOnPrimary,
      textDecorationLine: 'underline',
    },
  });
