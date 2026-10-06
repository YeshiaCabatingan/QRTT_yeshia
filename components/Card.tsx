import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Theme } from '@/constants/theme';
import { useThemedStyles, useTheme } from '@/lib/theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Adds an accent bar down the left edge. */
  accent?: boolean;
  /** Overrides the horizontal padding (pass 0 to let content bleed). */
  contentStyle?: StyleProp<ViewStyle>;
};

export default function Card({ children, style, accent, contentStyle }: Props) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View
      style={[
        styles.card,
        accent && { borderLeftWidth: 4, borderLeftColor: theme.primary },
        style,
      ]}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: theme.radius.card,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: theme.mode === 'dark' ? 0.4 : 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    content: {
      padding: 16,
    },
  });
