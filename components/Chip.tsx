import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import type { Theme } from '@/constants/theme';
import { useThemedStyles } from '@/lib/theme';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  /** `accent` = tinted pill with primary text (quick actions). */
  variant?: 'default' | 'accent';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export default function Chip({
  label,
  active = false,
  onPress,
  disabled = false,
  variant = 'default',
  icon,
  style,
}: Props) {
  const styles = useThemedStyles(makeStyles);

  const state = variant === 'accent' || active ? 'active' : 'idle';
  const tint = state === 'active' ? styles.activeText.color : styles.idleText.color;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.chip,
        state === 'active' && styles.chipActive,
        pressed && styles.pressed,
        (disabled || !onPress) && styles.disabled,
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={14} color={tint} style={styles.icon} />
      ) : null}
      <Text
        style={[
          styles.label,
          styles[state === 'active' ? 'activeText' : 'idleText'],
          state === 'active' && styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: theme.radius.chip,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
    },
    chipActive: {
      backgroundColor: theme.primaryTint,
      borderColor: theme.primaryBorder,
    },
    pressed: {
      opacity: 0.75,
      transform: [{ scale: 0.97 }],
    },
    disabled: {
      opacity: 0.5,
    },
    icon: {
      marginRight: 6,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
    },
    labelActive: {
      fontWeight: '700',
    },
    idleText: {
      color: theme.textSecondary,
    },
    activeText: {
      color: theme.primary,
    },
  });
