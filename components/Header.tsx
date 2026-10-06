import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { withAlpha, type Theme } from '@/constants/theme';
import { useThemedStyles, useTheme } from '@/lib/theme';

type Props = { title: string };

export default function Header({ title }: Props) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.container}>
      <View style={styles.emblem}>
        <View style={styles.halo} />
        <View style={styles.orbit} />
        <View style={styles.logoCircle}>
          <MaterialIcons name="qr-code-scanner" size={36} color={theme.logo} />
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rule} />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: 16,
    },
    emblem: {
      width: 96,
      height: 96,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    halo: {
      position: 'absolute',
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: withAlpha(theme.primary, 0.08),
    },
    orbit: {
      position: 'absolute',
      width: 84,
      height: 84,
      borderRadius: 42,
      borderWidth: 1.5,
      borderColor: theme.primaryBorder,
      borderStyle: 'dashed',
    },
    logoCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: 0.2,
    },
    rule: {
      width: 40,
      height: 4,
      borderRadius: 4,
      backgroundColor: theme.primary,
      marginTop: 8,
    },
  });
