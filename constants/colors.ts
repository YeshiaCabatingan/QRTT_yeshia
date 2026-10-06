import {
  buildTheme,
  DEFAULT_SETTINGS,
  type ColorTokens,
  type Theme,
} from './theme';

const initial = buildTheme(DEFAULT_SETTINGS, 'light');

/**
 * Live snapshot of the active theme's colour tokens.
 *
 * Every screen reads `COLORS.*`, and `syncColors()` refreshes this object
 * whenever the user changes their theme — so legacy consumers keep working
 * while `useTheme()` gives components the reactive value.
 */
export const COLORS: ColorTokens = {
  primary: initial.primary,
  background: initial.background,
  card: initial.card,
  textPrimary: initial.textPrimary,
  textSecondary: initial.textSecondary,
  textOnPrimary: initial.textOnPrimary,
  surface: initial.surface,
  border: initial.border,
  shadow: initial.shadow,
  warning: initial.warning,
  success: initial.success,
  danger: initial.danger,
  logo: initial.logo,
};

export function syncColors(theme: Theme): void {
  COLORS.primary = theme.primary;
  COLORS.background = theme.background;
  COLORS.card = theme.card;
  COLORS.textPrimary = theme.textPrimary;
  COLORS.textSecondary = theme.textSecondary;
  COLORS.textOnPrimary = theme.textOnPrimary;
  COLORS.surface = theme.surface;
  COLORS.border = theme.border;
  COLORS.shadow = theme.shadow;
  COLORS.warning = theme.warning;
  COLORS.success = theme.success;
  COLORS.danger = theme.danger;
  COLORS.logo = theme.logo;
}
