import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { readableOn, withAlpha, type Theme } from '@/constants/theme';
import { useThemedStyles, useTheme } from '@/lib/theme';

type Variant = 'solid' | 'soft' | 'outline' | 'ghost' | 'secondary';
type Tone = 'primary' | 'danger' | 'neutral';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme?: 'primary';
  onPress: () => void;
  disabled?: boolean;
  /** Overrides the user's global button style for this button only. */
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  style?: StyleProp<ViewStyle>;
};

type Palette = {
  background: string;
  border: string;
  borderWidth: number;
  text: string;
  icon: string;
  weight: '600' | '700';
};

function toneColor(theme: Theme, tone: Tone) {
  if (tone === 'danger') return theme.danger;
  if (tone === 'neutral') return theme.textPrimary;
  return theme.primary;
}

function buttonPalette(theme: Theme, variant: Variant, tone: Tone): Palette {
  const color = toneColor(theme, tone);

  switch (variant) {
    case 'solid':
      return {
        background: color,
        border: 'transparent',
        borderWidth: 0,
        text: readableOn(color),
        icon: readableOn(color),
        weight: '700',
      };
    case 'soft':
      return {
        background: withAlpha(color, 0.14),
        border: 'transparent',
        borderWidth: 0,
        text: color,
        icon: color,
        weight: '700',
      };
    case 'outline':
      return {
        background: theme.card,
        border: withAlpha(color, 0.5),
        borderWidth: 1.5,
        text: color,
        icon: color,
        weight: '700',
      };
    case 'ghost':
      return {
        background: 'transparent',
        border: 'transparent',
        borderWidth: 0,
        text: color,
        icon: color,
        weight: '600',
      };
    case 'secondary':
    default:
      return {
        background: theme.card,
        border: theme.border,
        borderWidth: 1,
        text: theme.textPrimary,
        icon: theme.textSecondary,
        weight: '600',
      };
  }
}

export default function AppButton({
  title,
  icon,
  theme: themeProp,
  onPress,
  disabled = false,
  variant,
  tone = 'primary',
  size = 'md',
  style,
}: Props) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  const resolved: Variant =
    variant ?? (themeProp === 'primary' ? theme.buttonStyle : 'secondary');
  const palette = buttonPalette(theme, resolved, tone);
  const sizeStyles = SIZE_STYLES[size];

  return (
    <View style={[styles.buttonOuter, sizeStyles.outer, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.buttonInner,
          sizeStyles.inner,
          {
            backgroundColor: palette.background,
            borderColor: palette.border,
            borderWidth: palette.borderWidth,
          },
          pressed && styles.pressed,
          disabled && styles.buttonDisabled,
        ]}
      >
        <Ionicons
          name={icon}
          size={sizeStyles.icon}
          color={palette.icon}
          style={styles.icon}
        />
        <Text
          style={[
            styles.label,
            sizeStyles.label,
            { color: palette.text, fontWeight: palette.weight },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const SIZE_STYLES = {
  sm: {
    outer: { marginBottom: 10 },
    inner: { paddingVertical: 10, paddingHorizontal: 16 },
    label: { fontSize: 14 },
    icon: 18,
  },
  md: {
    outer: { marginBottom: 14 },
    inner: { paddingVertical: 16, paddingHorizontal: 20 },
    label: { fontSize: 17 },
    icon: 22,
  },
  lg: {
    outer: { marginBottom: 16 },
    inner: { paddingVertical: 18, paddingHorizontal: 22 },
    label: { fontSize: 18 },
    icon: 24,
  },
} as const;

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    buttonOuter: {
      width: '100%',
    },
    buttonInner: {
      borderRadius: theme.radius.button,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      overflow: 'hidden',
    },
    pressed: {
      opacity: 0.88,
      transform: [{ scale: 0.985 }],
    },
    buttonDisabled: {
      opacity: 0.55,
    },
    icon: { paddingRight: 10 },
    label: {
      textAlign: 'center',
    },
  });
