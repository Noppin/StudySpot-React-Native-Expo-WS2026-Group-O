/**
 * Minimal design tokens: neutral surfaces, one accent colour,
 * hairline borders and a small type scale.
 */
export const theme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F7F7F5',
    text: '#141414',
    muted: '#6E6E6A',
    subtle: '#A3A39E',
    border: '#E9E9E6',
    accent: '#1F6F4A',
    accentSoft: '#EDF4F0',
    onAccent: '#FFFFFF',
    danger: '#B3261E',
    dangerSoft: '#FBEDEB',
    warning: '#8A5A13',
    warningSoft: '#FAF3E6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    screen: 20,
  },
  radius: {
    sm: 8,
    md: 12,
    pill: 999,
  },
  type: {
    title: { fontSize: 28, fontWeight: '600', letterSpacing: -0.6 },
    heading: { fontSize: 17, fontWeight: '600', letterSpacing: -0.2 },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 21 },
    caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
    label: { fontSize: 12, fontWeight: '500', letterSpacing: 0.2 },
  },
} as const;
