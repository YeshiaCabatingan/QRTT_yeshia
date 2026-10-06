import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Theme } from '@/constants/theme';
import { useThemedStyles } from '@/lib/theme';

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  style,
}: Props<T>) {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.track, style]}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.segment,
              active && styles.segmentActive,
              pressed && !active && styles.pressed,
            ]}
          >
            {option.icon ? (
              <Ionicons
                name={option.icon}
                size={15}
                color={active ? styles.activeText.color : styles.idleText.color}
                style={styles.icon}
              />
            ) : null}
            <Text
              style={[styles.label, active ? styles.activeText : styles.idleText]}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: theme.radius.chip,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 4,
    },
    segment: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 9,
      paddingHorizontal: 8,
      borderRadius: theme.radius.chip === 999 ? 999 : theme.radius.md,
    },
    segmentActive: {
      backgroundColor: theme.primary,
    },
    pressed: {
      opacity: 0.7,
    },
    icon: {
      marginRight: 6,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
    },
    idleText: {
      color: theme.textSecondary,
    },
    activeText: {
      color: theme.textOnPrimary,
      fontWeight: '700',
    },
  });
