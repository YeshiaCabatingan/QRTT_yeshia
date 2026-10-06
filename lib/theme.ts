import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useSyncExternalStore } from 'react';
import { useColorScheme } from 'react-native';

import { syncColors } from '@/constants/colors';
import {
  buildTheme,
  DEFAULT_SETTINGS,
  sanitizeSettings,
  type Theme,
  type ThemeSettings,
} from '@/constants/theme';

const STORAGE_KEY = 'qratt:theme-settings';

let settings: ThemeSettings = DEFAULT_SETTINGS;
let loadPromise: Promise<void> | null = null;
const listeners: Set<() => void> = new Set();

function publish() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return settings;
}

async function persist() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage failures only mean the preference is not remembered.
  }
}

export function getThemeSettings(): ThemeSettings {
  return settings;
}

export function setThemeSettings(patch: Partial<ThemeSettings>): void {
  settings = sanitizeSettings({ ...settings, ...patch });
  publish();
  void persist();
}

export function resetThemeSettings(): void {
  settings = DEFAULT_SETTINGS;
  publish();
  void persist();
}

export function loadThemeSettings(): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        settings = sanitizeSettings(JSON.parse(raw));
        publish();
      }
    } catch {
      // Fall back to the default look.
    }
  })();
  return loadPromise;
}

export function useThemeSettings(): ThemeSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useTheme(): Theme {
  const themeSettings = useThemeSettings();
  const systemScheme = useColorScheme();
  const theme = useMemo(
    () => buildTheme(themeSettings, systemScheme),
    [themeSettings, systemScheme]
  );
  syncColors(theme);
  return theme;
}

export function useThemedStyles<T>(makeStyles: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => makeStyles(theme), [theme, makeStyles]);
}
