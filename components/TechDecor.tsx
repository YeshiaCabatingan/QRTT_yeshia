import { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { withAlpha, type Theme } from '@/constants/theme';
import { useThemedStyles } from '@/lib/theme';

const RETICLE_COLOR = 'rgba(255,255,255,0.92)';

/** Faint blueprint grid used as a background texture. Purely decorative. */
export function GridBackdrop({
  cell = 44,
  style,
}: {
  cell?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useThemedStyles(makeStyles);
  const { width, height } = useWindowDimensions();
  const columns = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;

  return (
    <View pointerEvents="none" style={[styles.grid, style]}>
      <View style={[styles.layer, { width: columns * cell, height: rows * cell }]}>
        {Array.from({ length: columns }, (_, index) => (
          <View key={`c${index}`} style={[styles.cell, { width: cell }]} />
        ))}
      </View>
      <View style={[styles.layer, styles.layerRows, { width: columns * cell, height: rows * cell }]}>
        {Array.from({ length: rows }, (_, index) => (
          <View key={`r${index}`} style={[styles.cellRow, { height: cell }]} />
        ))}
      </View>
    </View>
  );
}

/** Pulsing scan brackets + travelling beam — the QR "targeting" frame. */
export function CornerReticle({ size = 232, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  const styles = useThemedStyles(makeStyles);
  const pulse = useRef(new Animated.Value(1)).current;
  const beam = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.35, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    const beamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(beam, { toValue: 1, duration: 2200, useNativeDriver: true }),
        Animated.timing(beam, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    pulseLoop.start();
    beamLoop.start();
    return () => {
      pulseLoop.stop();
      beamLoop.stop();
    };
  }, [pulse, beam]);

  const beamTranslate = beam.interpolate({
    inputRange: [0, 1],
    outputRange: [14, size - 14],
  });

  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      <Animated.View
        style={[
          styles.bracket,
          styles.cornerTL,
          { borderTopColor: RETICLE_COLOR, borderLeftColor: RETICLE_COLOR },
          { opacity: pulse },
        ]}
      />
      <Animated.View
        style={[
          styles.bracket,
          styles.cornerTR,
          { borderTopColor: RETICLE_COLOR, borderRightColor: RETICLE_COLOR },
          { opacity: pulse },
        ]}
      />
      <Animated.View
        style={[
          styles.bracket,
          styles.cornerBL,
          { borderBottomColor: RETICLE_COLOR, borderLeftColor: RETICLE_COLOR },
          { opacity: pulse },
        ]}
      />
      <Animated.View
        style={[
          styles.bracket,
          styles.cornerBR,
          { borderBottomColor: RETICLE_COLOR, borderRightColor: RETICLE_COLOR },
          { opacity: pulse },
        ]}
      />
      <Animated.View
        style={[styles.beam, { width: size - 40, transform: [{ translateY: beamTranslate }] }]}
      />
    </View>
  );
}

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    grid: {
      ...StyleSheet.absoluteFillObject,
      overflow: 'hidden',
      opacity: theme.mode === 'dark' ? 0.9 : 0.6,
    },
    layer: {
      position: 'absolute',
      top: 0,
      left: 0,
      flexDirection: 'row',
    },
    layerRows: {
      flexDirection: 'column',
    },
    cell: {
      height: '100%',
      borderRightWidth: 1,
      borderColor: withAlpha(theme.primary, 0.08),
    },
    cellRow: {
      width: '100%',
      borderBottomWidth: 1,
      borderColor: withAlpha(theme.primary, 0.08),
    },
    bracket: {
      position: 'absolute',
      width: 42,
      height: 42,
    },
    cornerTL: {
      top: 0,
      left: 0,
      borderTopWidth: 4,
      borderLeftWidth: 4,
      borderTopLeftRadius: theme.radius.md,
    },
    cornerTR: {
      top: 0,
      right: 0,
      borderTopWidth: 4,
      borderRightWidth: 4,
      borderTopRightRadius: theme.radius.md,
    },
    cornerBL: {
      bottom: 0,
      left: 0,
      borderBottomWidth: 4,
      borderLeftWidth: 4,
      borderBottomLeftRadius: theme.radius.md,
    },
    cornerBR: {
      bottom: 0,
      right: 0,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderBottomRightRadius: theme.radius.md,
    },
    beam: {
      position: 'absolute',
      left: 20,
      height: 3,
      borderRadius: 3,
      backgroundColor: withAlpha(theme.primary, 0.9),
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 8,
      elevation: 6,
    },
  });
