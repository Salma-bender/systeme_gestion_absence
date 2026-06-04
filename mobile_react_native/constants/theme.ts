import { Platform } from 'react-native';

// Couleurs FST Marrakech — identiques à l'app web
export const Colors = {
  brown:       '#8B4513',
  brownDark:   '#5C2E00',
  brownLight:  '#A0522D',
  gold:        '#C8922A',
  goldLight:   '#E8B84B',
  cream:       '#FDF6EC',
  creamDark:   '#F5ECD8',
  white:       '#FFFFFF',
  text:        '#2C1810',
  textLight:   '#6B4C3B',
  border:      '#E8D5C0',
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
});
