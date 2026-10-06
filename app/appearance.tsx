import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import Card from '@/components/Card';
import Chip from '@/components/Chip';
import Field from '@/components/Field';
import Segmented from '@/components/Segmented';
import { GridBackdrop } from '@/components/TechDecor';
import {
  PRESETS,
  type ButtonStyle,
  type ModePref,
  type RadiusSize,
  type Theme,
} from '@/constants/theme';
import {
  resetThemeSettings,
  setThemeSettings,
  useTheme,
  useThemeSettings,
  useThemedStyles,
} from '@/lib/theme';

const ACCENTS: { label: string; color: string }[] = [
  { label: 'Rose', color: '#DB2777' },
  { label: 'Cyan', color: '#0891B2' },
  { label: 'Blue', color: '#2563EB' },
  { label: 'Violet', color: '#7C3AED' },
  { label: 'Emerald', color: '#059669' },
  { label: 'Amber', color: '#D97706' },
  { label: 'Crimson', color: '#DC2626' },
  { label: 'Graphite', color: '#111827' },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const settings = useThemeSettings();
  const styles = useThemedStyles(makeStyles);

  const confirmReset = () => {
    Alert.alert('Reset appearance', 'Restore the default theme and shapes?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetThemeSettings },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <GridBackdrop cell={48} />

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title}>Customize UI</Text>
          <Text style={styles.subtitle}>Theme, accent, shape & buttons</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: theme.primaryTint }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            {theme.mode === 'dark' ? 'DARK' : 'LIGHT'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 40 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle icon="contrast-outline" title="Appearance" />
        <View style={styles.block}>
          <Segmented<ModePref>
            options={[
              { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
              { value: 'light', label: 'Light', icon: 'sunny-outline' },
              { value: 'dark', label: 'Dark', icon: 'moon-outline' },
            ]}
            value={settings.mode}
            onChange={(mode) => setThemeSettings({ mode })}
          />
        </View>

        <SectionTitle icon="color-palette-outline" title="Theme" />
        <View style={styles.presetGrid}>
          {PRESETS.map((preset) => {
            const active = preset.id === settings.preset;
            return (
              <Pressable
                key={preset.id}
                onPress={() => setThemeSettings({ preset: preset.id })}
                style={({ pressed }) => [
                  styles.presetCard,
                  active && {
                    borderColor: theme.primary,
                    backgroundColor: theme.primarySoft,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.swatchStack}>
                  <View style={[styles.swatch, { backgroundColor: preset.preview.light[0] }]} />
                  <View style={[styles.swatch, { backgroundColor: preset.preview.light[1] }]} />
                  <View style={[styles.swatch, { backgroundColor: preset.preview.dark[1] }]} />
                  <View style={[styles.swatch, { backgroundColor: preset.preview.dark[0] }]} />
                </View>
                <View style={styles.presetMeta}>
                  <Text style={[styles.presetLabel, active && { color: theme.primary }]}>
                    {preset.label}
                  </Text>
                  <Text style={styles.presetDescription} numberOfLines={1}>
                    {preset.description}
                  </Text>
                </View>
                {active ? (
                  <View style={[styles.check, { backgroundColor: theme.primary }]}>
                    <Ionicons name="checkmark" size={12} color={theme.textOnPrimary} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <SectionTitle icon="radio-button-on-outline" title="Accent colour" />
        <View style={styles.block}>
          <View style={styles.swatchRow}>
            <Pressable
              onPress={() => setThemeSettings({ accent: null })}
              style={({ pressed }) => [
                styles.accentSwatch,
                { backgroundColor: theme.surface },
                settings.accent === null && styles.accentSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.autoLabel,
                  {
                    color:
                      settings.accent === null ? theme.textPrimary : theme.textSecondary,
                  },
                ]}
              >
                AUTO
              </Text>
            </Pressable>
            {ACCENTS.map((accent) => {
              const active =
                !!settings.accent &&
                settings.accent.toUpperCase() === accent.color.toUpperCase();
              return (
                <Pressable
                  key={accent.color}
                  accessibilityLabel={accent.label}
                  onPress={() => setThemeSettings({ accent: accent.color })}
                  style={({ pressed }) => [
                    styles.accentSwatch,
                    { backgroundColor: accent.color },
                    active && styles.accentSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  {active ? (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.code}>
            accent: {settings.accent ?? 'preset default'} · preset: {settings.preset}
          </Text>
        </View>

        <SectionTitle icon="shapes-outline" title="Corners" />
        <View style={styles.block}>
          <Segmented<RadiusSize>
            options={[
              { value: 'sharp', label: 'Sharp' },
              { value: 'soft', label: 'Soft' },
              { value: 'round', label: 'Round' },
              { value: 'pill', label: 'Pill' },
            ]}
            value={settings.radius}
            onChange={(radius) => setThemeSettings({ radius })}
          />
        </View>

        <SectionTitle icon="hand-left-outline" title="Buttons" />
        <View style={styles.block}>
          <Segmented<ButtonStyle>
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'soft', label: 'Soft' },
              { value: 'outline', label: 'Outline' },
            ]}
            value={settings.buttonStyle}
            onChange={(buttonStyle) => setThemeSettings({ buttonStyle })}
          />
        </View>

        <SectionTitle icon="eye-outline" title="Live preview" />
        <Card style={styles.previewCard}>
          <Text style={styles.previewHeading}>Sample event</Text>
          <Text style={styles.previewBody}>
            Everything above updates instantly across every screen.
          </Text>
          <View style={styles.previewChips}>
            <Chip label="Student" active />
            <Chip label="+1 hour" variant="accent" />
            <Chip label="Disabled" disabled />
          </View>
          <Field icon="mail-outline" defaultValue="student@school.edu" editable={false} />
          <View style={styles.previewButtons}>
            <AppButton
              theme="primary"
              title="Primary action"
              icon="qr-code-outline"
              onPress={() => {}}
            />
            <AppButton title="Secondary action" icon="time-outline" onPress={() => {}} />
            <AppButton
              title="Danger zone"
              icon="trash-outline"
              tone="danger"
              variant="soft"
              onPress={() => {}}
            />
          </View>
        </Card>

        <View style={styles.resetWrap}>
          <AppButton
            title="Reset to defaults"
            icon="refresh-outline"
            tone="danger"
            variant="outline"
            size="sm"
            onPress={confirmReset}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}) {
  const theme = useTheme();
  const styles = useThemedStyles(makeSectionStyles);
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: theme.primaryTint }]}>
        <Ionicons name={icon} size={15} color={theme.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const makeSectionStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 22,
      marginBottom: 10,
    },
    iconWrap: {
      width: 26,
      height: 26,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    title: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  });

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    backPressed: {
      opacity: 0.7,
      transform: [{ scale: 0.95 }],
    },
    headerText: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: theme.radius.chip,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
    },
    content: {
      paddingHorizontal: 20,
    },
    block: {
      marginBottom: 4,
    },
    pressed: {
      opacity: 0.8,
      transform: [{ scale: 0.98 }],
    },
    presetGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    presetCard: {
      width: '50%',
      paddingRight: 8,
      paddingBottom: 12,
      borderWidth: 1.5,
      borderColor: 'transparent',
      borderRadius: theme.radius.card,
    },
    swatchStack: {
      flexDirection: 'row',
      borderRadius: theme.radius.card,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    swatch: {
      flex: 1,
      height: 44,
    },
    presetMeta: {
      marginTop: 6,
      paddingLeft: 2,
    },
    presetLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    presetDescription: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 1,
    },
    check: {
      position: 'absolute',
      top: 10,
      right: 12,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    swatchRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    accentSwatch: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.border,
    },
    accentSelected: {
      borderColor: theme.textPrimary,
      transform: [{ scale: 1.06 }],
    },
    autoLabel: {
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    code: {
      fontSize: 12,
      color: theme.textSecondary,
      fontFamily: 'monospace',
      marginTop: 2,
    },
    previewCard: {
      marginTop: 2,
    },
    previewHeading: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: 4,
    },
    previewBody: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 19,
      marginBottom: 12,
    },
    previewChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 6,
    },
    previewButtons: {
      marginTop: 14,
    },
    resetWrap: {
      marginTop: 26,
    },
  });
