import Ionicons from '@expo/vector-icons/Ionicons';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import type { Theme } from '@/constants/theme';
import { useThemedStyles } from '@/lib/theme';

type Props = TextInputProps & {
  icon?: keyof typeof Ionicons.glyphMap;
  /** Applied to the outer frame when `icon` is set, else to the input. */
  frameStyle?: StyleProp<ViewStyle>;
};

export default function Field({ icon, frameStyle, style, ...rest }: Props) {
  const styles = useThemedStyles(makeStyles);
  const input = <TextInput style={[styles.input, !icon && style]} {...rest} />;

  if (!icon) return input;

  return (
    <View style={[styles.frame, frameStyle]}>
      <Ionicons name={icon} size={18} color={styles.icon.color} style={styles.icon} />
      <TextInput style={[styles.input, styles.inputWithIcon, style]} {...rest} />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    frame: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: theme.radius.input,
      borderWidth: 1.5,
      borderColor: theme.border,
      paddingHorizontal: 14,
    },
    icon: {
      color: theme.textSecondary,
      marginRight: 10,
    },
    input: {
      backgroundColor: theme.card,
      borderRadius: theme.radius.input,
      borderWidth: 1.5,
      borderColor: theme.border,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.textPrimary,
    },
    inputWithIcon: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      paddingHorizontal: 0,
      paddingVertical: 14,
      flex: 1,
    },
  });
