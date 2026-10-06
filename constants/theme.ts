export type ThemeMode = 'light' | 'dark';
export type ModePref = ThemeMode | 'system';
export type ThemePresetId =
  | 'pink'
  | 'cyber'
  | 'matrix'
  | 'ocean'
  | 'violet'
  | 'graphite';
export type RadiusSize = 'sharp' | 'soft' | 'round' | 'pill';
export type ButtonStyle = 'solid' | 'soft' | 'outline';

export type ThemeSettings = {
  preset: ThemePresetId;
  mode: ModePref;
  accent: string | null;
  radius: RadiusSize;
  buttonStyle: ButtonStyle;
};

export type ColorTokens = {
  primary: string;
  background: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  surface: string;
  border: string;
  shadow: string;
  warning: string;
  success: string;
  danger: string;
  logo: string;
};

export type RadiusTokens = {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  button: number;
  card: number;
  input: number;
  chip: number;
};

export type Theme = ColorTokens & {
  mode: ThemeMode;
  preset: ThemePresetId;
  buttonStyle: ButtonStyle;
  primarySoft: string;
  primaryTint: string;
  primaryBorder: string;
  scrim: string;
  radius: RadiusTokens;
};

type Palette = Omit<ColorTokens, 'textOnPrimary' | 'shadow' | 'logo'>;

type Preset = {
  id: ThemePresetId;
  label: string;
  description: string;
  preview: { light: string[]; dark: string[] };
  light: Palette;
  dark: Palette;
};

const SEMANTIC = {
  success: '#2E7D5B',
  danger: '#B3261E',
  warning: '#C97A2B',
} as const;

const SEMANTIC_DARK = {
  success: '#34D399',
  danger: '#F87171',
  warning: '#FBBF24',
} as const;

export const PRESETS: Preset[] = [
  {
    id: 'pink',
    label: 'Rosé',
    description: 'Soft blush — the original look',
    preview: {
      light: ['#DB2777', '#FDF6F9', '#FAECF2'],
      dark: ['#F05690', '#150F14', '#2A1F27'],
    },
    light: {
      primary: '#DB2777',
      background: '#FDF6F9',
      card: '#FFFFFF',
      surface: '#FAECF2',
      border: '#F1DCE6',
      textPrimary: '#1F1A1D',
      textSecondary: '#6E5A66',
      ...SEMANTIC,
    },
    dark: {
      primary: '#F05690',
      background: '#150F14',
      card: '#20171E',
      surface: '#2A1F27',
      border: '#3A2A34',
      textPrimary: '#F6ECF2',
      textSecondary: '#C2A9B6',
      ...SEMANTIC_DARK,
    },
  },
  {
    id: 'cyber',
    label: 'Cyber',
    description: 'Cyan terminal glow',
    preview: {
      light: ['#0891B2', '#F2FAFC', '#E4F3F7'],
      dark: ['#22D3EE', '#070C12', '#14202C'],
    },
    light: {
      primary: '#0891B2',
      background: '#F2FAFC',
      card: '#FFFFFF',
      surface: '#E4F3F7',
      border: '#CBE6EE',
      textPrimary: '#0B1B21',
      textSecondary: '#4A6670',
      success: '#15803D',
      danger: '#DC2626',
      warning: '#D97706',
    },
    dark: {
      primary: '#22D3EE',
      background: '#070C12',
      card: '#0E1620',
      surface: '#14202C',
      border: '#1F3140',
      textPrimary: '#DAF4F8',
      textSecondary: '#86A6B3',
      success: '#34D399',
      danger: '#F87171',
      warning: '#FBBF24',
    },
  },
  {
    id: 'matrix',
    label: 'Console',
    description: 'Green phosphor terminal',
    preview: {
      light: ['#15803D', '#F1FAF3', '#E3F3E7'],
      dark: ['#4ADE80', '#061009', '#112017'],
    },
    light: {
      primary: '#15803D',
      background: '#F1FAF3',
      card: '#FFFFFF',
      surface: '#E3F3E7',
      border: '#CBE5D3',
      textPrimary: '#0F1B13',
      textSecondary: '#4A6352',
      success: '#15803D',
      danger: '#DC2626',
      warning: '#D97706',
    },
    dark: {
      primary: '#4ADE80',
      background: '#061009',
      card: '#0C1710',
      surface: '#112017',
      border: '#1B3125',
      textPrimary: '#DCF6E5',
      textSecondary: '#8FB39B',
      success: '#4ADE80',
      danger: '#F87171',
      warning: '#FBBF24',
    },
  },
  {
    id: 'ocean',
    label: 'Blueprint',
    description: 'Engineering blue',
    preview: {
      light: ['#2563EB', '#F3F7FF', '#E6EDFC'],
      dark: ['#60A5FA', '#070B14', '#131C2E'],
    },
    light: {
      primary: '#2563EB',
      background: '#F3F7FF',
      card: '#FFFFFF',
      surface: '#E6EDFC',
      border: '#D3DEF6',
      textPrimary: '#101828',
      textSecondary: '#4C5A72',
      success: '#059669',
      danger: '#DC2626',
      warning: '#D97706',
    },
    dark: {
      primary: '#60A5FA',
      background: '#070B14',
      card: '#0E1524',
      surface: '#131C2E',
      border: '#1F2C44',
      textPrimary: '#E1E9F7',
      textSecondary: '#93A3BF',
      success: '#34D399',
      danger: '#F87171',
      warning: '#FBBF24',
    },
  },
  {
    id: 'violet',
    label: 'Ultraviolet',
    description: 'Deep violet focus',
    preview: {
      light: ['#7C3AED', '#F7F4FF', '#EFE8FE'],
      dark: ['#A78BFA', '#0B0813', '#1A142A'],
    },
    light: {
      primary: '#7C3AED',
      background: '#F7F4FF',
      card: '#FFFFFF',
      surface: '#EFE8FE',
      border: '#E0D6FB',
      textPrimary: '#17111F',
      textSecondary: '#5C5270',
      success: '#059669',
      danger: '#DC2626',
      warning: '#D97706',
    },
    dark: {
      primary: '#A78BFA',
      background: '#0B0813',
      card: '#130F1F',
      surface: '#1A142A',
      border: '#2A2140',
      textPrimary: '#EDE7FB',
      textSecondary: '#A79BC4',
      success: '#34D399',
      danger: '#F87171',
      warning: '#FBBF24',
    },
  },
  {
    id: 'graphite',
    label: 'Graphite',
    description: 'Monochrome minimal',
    preview: {
      light: ['#111827', '#F5F6F8', '#EBEDF1'],
      dark: ['#E5E7EB', '#0A0C10', '#191D24'],
    },
    light: {
      primary: '#111827',
      background: '#F5F6F8',
      card: '#FFFFFF',
      surface: '#EBEDF1',
      border: '#DADDE3',
      textPrimary: '#0B0F14',
      textSecondary: '#5A6270',
      success: '#059669',
      danger: '#DC2626',
      warning: '#D97706',
    },
    dark: {
      primary: '#E5E7EB',
      background: '#0A0C10',
      card: '#12151B',
      surface: '#191D24',
      border: '#262B34',
      textPrimary: '#EFF1F5',
      textSecondary: '#9AA1AE',
      success: '#34D399',
      danger: '#F87171',
      warning: '#FBBF24',
    },
  },
];

export const PRESET_MAP: Record<ThemePresetId, Preset> = PRESETS.reduce(
  (acc, preset) => {
    acc[preset.id] = preset;
    return acc;
  },
  {} as Record<ThemePresetId, Preset>
);

export const RADIUS_SIZES: Record<RadiusSize, RadiusTokens> = {
  sharp: { sm: 4, md: 6, lg: 8, xl: 10, button: 6, card: 8, input: 6, chip: 6 },
  soft: { sm: 8, md: 10, lg: 14, xl: 18, button: 12, card: 16, input: 12, chip: 999 },
  round: { sm: 12, md: 16, lg: 22, xl: 28, button: 18, card: 24, input: 18, chip: 999 },
  pill: { sm: 999, md: 999, lg: 999, xl: 999, button: 999, card: 28, input: 999, chip: 999 },
};

export const DEFAULT_SETTINGS: ThemeSettings = {
  preset: 'violet',
  mode: 'dark',
  accent: null,
  radius: 'soft',
  buttonStyle: 'solid',
};

export function normalizeHex(input: string): string {
  const raw = input.trim().replace(/^#/, '');
  if (raw.length === 3) {
    return `#${raw[0]}${raw[0]}${raw[1]}${raw[1]}${raw[2]}${raw[2]}`.toUpperCase();
  }
  if (raw.length === 6 || raw.length === 8) {
    return `#${raw.slice(0, 6).toUpperCase()}`;
  }
  return input;
}

export function isHex(input: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(input.trim());
}

export function withAlpha(hex: string, alpha: number): string {
  const safe = Math.max(0, Math.min(1, alpha));
  const value = Math.round(safe * 255)
    .toString(16)
    .padStart(2, '0');
  return `${normalizeHex(hex)}${value.toUpperCase()}`;
}

function toRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = normalizeHex(hex).replace('#', '');
  const int = parseInt(normalized.slice(0, 6), 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = toRgb(hex);
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Picks white or deep ink so labels stay readable on any accent colour. */
export function readableOn(hex: string): string {
  const lum = relativeLuminance(hex);
  const inkLum = 0.0046;
  const onWhite = 1.05 / (lum + 0.05);
  const onInk = (lum + 0.05) / (inkLum + 0.05);
  return onWhite >= onInk ? '#FFFFFF' : '#0B0F14';
}

export function buildTheme(
  settings: ThemeSettings,
  systemMode?: 'light' | 'dark' | null
): Theme {
  const preset =
    PRESET_MAP[settings.preset] ?? PRESET_MAP[DEFAULT_SETTINGS.preset];
  const mode: ThemeMode =
    settings.mode === 'system' ? (systemMode === 'dark' ? 'dark' : 'light') : settings.mode;
  const palette = mode === 'dark' ? preset.dark : preset.light;
  const accent = settings.accent && isHex(settings.accent) ? settings.accent : null;
  const primary = normalizeHex(accent ?? palette.primary);

  return {
    mode,
    preset: preset.id,
    buttonStyle: settings.buttonStyle,
    primary,
    background: palette.background,
    card: palette.card,
    surface: palette.surface,
    border: palette.border,
    textPrimary: palette.textPrimary,
    textSecondary: palette.textSecondary,
    textOnPrimary: readableOn(primary),
    logo: primary,
    shadow: mode === 'dark' ? '#000000' : palette.textPrimary,
    success: palette.success,
    danger: palette.danger,
    warning: palette.warning,
    primarySoft: withAlpha(primary, 0.12),
    primaryTint: withAlpha(primary, 0.16),
    primaryBorder: withAlpha(primary, 0.45),
    scrim: mode === 'dark' ? 'rgba(0,0,0,0.72)' : 'rgba(8,4,10,0.55)',
    radius: RADIUS_SIZES[settings.radius] ?? RADIUS_SIZES.soft,
  };
}

export function sanitizeSettings(input: unknown): ThemeSettings {
  const value = (input && typeof input === 'object' ? input : {}) as Record<
    string,
    unknown
  >;
  const preset = value.preset;
  const mode = value.mode;
  const radius = value.radius;
  const buttonStyle = value.buttonStyle;
  const accent = value.accent;

  return {
    preset:
      typeof preset === 'string' && preset in PRESET_MAP
        ? (preset as ThemePresetId)
        : DEFAULT_SETTINGS.preset,
    mode:
      mode === 'light' || mode === 'dark' || mode === 'system'
        ? mode
        : DEFAULT_SETTINGS.mode,
    accent: typeof accent === 'string' && isHex(accent) ? normalizeHex(accent) : null,
    radius:
      radius === 'sharp' || radius === 'soft' || radius === 'round' || radius === 'pill'
        ? radius
        : DEFAULT_SETTINGS.radius,
    buttonStyle:
      buttonStyle === 'solid' || buttonStyle === 'soft' || buttonStyle === 'outline'
        ? buttonStyle
        : DEFAULT_SETTINGS.buttonStyle,
  };
}
