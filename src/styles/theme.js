// Theme colors configuration for FindIt app
// Light and Dark mode professional color palettes & Claymorphism style helpers

export const typography = {
  appTitle: { fontFamily: 'Poppins_800ExtraBold' },
  h1: { fontFamily: 'Poppins_800ExtraBold' },
  subtitle: { fontFamily: 'Poppins_600SemiBold' },
};

export const lightTheme = {
  background: '#F8F1EF',
  surface: '#FDF8F6',
  primary: '#A75D5D',
  accent: '#D97706',
  textPrimary: '#4A3E3D',
  textSecondary: '#806C69',
  border: '#EAD8D3',
  inputBg: '#FDF8F6',
  success: '#10B981',        // Emerald Green ("Found" badges)
  successBg: '#DCFCE7',      // Soft Green background
  accentBg: '#FEF3C7',       // Soft Amber background
  dangerBg: '#FEE2E2',       // Soft Red background
  danger: '#EF4444',         // Red alert/delete
  textHeading: '#9E5A5A',
  textBody: '#4A3E3D',
  clayCardBg: '#FDF8F6',
  clayCardShadowLight: '#FFFFFF',
  clayCardShadowDark: '#EAD8D3',
  primaryButton: '#A75D5D',
  accentAmber: '#D97706',
  isDark: false,
  typography,
};

export const darkTheme = {
  background: '#1C1717',
  surface: '#2D2424',
  primary: '#A75D5D',
  accent: '#D97706',
  textPrimary: '#E2D5D5',
  textSecondary: '#B9A5A5',
  border: '#493838',
  inputBg: '#241D1D',
  success: '#34D399',        // Bright Green ("Found" badges)
  successBg: '#064E3B',      // Dark Green background
  accentBg: '#78350F',       // Dark Amber background
  dangerBg: '#7F1D1D',       // Dark Red background
  danger: '#F87171',         // Red alert/delete
  textHeading: '#F3D5D5',
  textBody: '#E2D5D5',
  clayCardBg: '#2D2424',
  clayCardShadowLight: '#493838',
  clayCardShadowDark: '#120F0F',
  primaryButton: '#A75D5D',
  accentAmber: '#D97706',
  isDark: true,
  typography,
};

/**
 * Reusable Claymorphism (Clay UI) Style Helpers
 * Tactile inflated surfaces, soft outer elevation, perimeter highlight, and bottom extrusion
 */

// Clay Card: tactile inflated surface with soft dual shadow and extruded bottom rim
export const getClayCardStyle = (isDark, customBg = null) => ({
  backgroundColor: customBg || (isDark ? darkTheme.clayCardBg : lightTheme.clayCardBg),
  borderRadius: 22,
  padding: 18,
  // Soft outer elevation
  shadowColor: isDark ? darkTheme.clayCardShadowDark : lightTheme.clayCardShadowDark,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: isDark ? 0.5 : 0.35,
  shadowRadius: 14,
  elevation: 6,
  // Clay perimeter highlight & bottom rim extrusion
  borderWidth: 1.5,
  borderColor: isDark ? darkTheme.clayCardShadowLight + '55' : lightTheme.clayCardShadowLight,
  borderBottomWidth: 3.5,
  borderBottomColor: isDark ? darkTheme.clayCardShadowDark : lightTheme.clayCardShadowDark,
});

// Clay Button: 3D inflated button with tactile pressable feedback
export const getClayButtonStyle = (isDark, bgColor, pressed = false) => ({
  backgroundColor: bgColor,
  borderRadius: 20,
  paddingVertical: pressed ? 13 : 14,
  paddingHorizontal: 18,
  shadowColor: isDark ? '#120F0F' : (bgColor || lightTheme.primaryButton),
  shadowOffset: pressed ? { width: 0, height: 2 } : { width: 0, height: 6 },
  shadowOpacity: pressed ? 0.15 : (isDark ? 0.4 : 0.28),
  shadowRadius: pressed ? 4 : 10,
  elevation: pressed ? 2 : 5,
  borderWidth: 1.5,
  borderColor: 'rgba(255, 255, 255, 0.35)',
  borderBottomWidth: pressed ? 1.5 : 3.5,
  borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  transform: pressed ? [{ translateY: 2 }] : [{ translateY: 0 }],
});

// Clay Pill: rounded pill-shaped button for categories and filter chips
export const getClayPillStyle = (isDark, customBg = null, active = false) => ({
  borderRadius: 50,
  paddingHorizontal: 16,
  paddingVertical: 10,
  backgroundColor: customBg || (isDark ? darkTheme.clayCardBg : lightTheme.clayCardBg),
  shadowColor: isDark ? darkTheme.clayCardShadowDark : lightTheme.clayCardShadowDark,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: isDark ? 0.35 : 0.08,
  shadowRadius: 6,
  elevation: 3,
  borderWidth: 1.2,
  borderColor: active ? (isDark ? darkTheme.primaryButton : lightTheme.primaryButton) : (isDark ? darkTheme.clayCardShadowLight + '22' : lightTheme.clayCardShadowLight),
  borderBottomWidth: 2.5,
  borderBottomColor: isDark ? darkTheme.clayCardShadowDark : lightTheme.clayCardShadowDark,
});

// Clay Badge: pill-shaped status badge ("LOST" in Amber, "FOUND" in Emerald/Indigo)
export const getClayBadgeStyle = (isDark, type = 'lost') => {
  const isLost = type?.toLowerCase() === 'lost';
  const bg = isLost
    ? (isDark ? '#78350F' : '#FEF3C7')
    : (isDark ? '#064E3B' : '#DCFCE7');
  const border = isLost
    ? '#D97706'
    : (isDark ? '#34D399' : '#10B981');

  return {
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: bg,
    borderWidth: 1,
    borderColor: isDark ? border + '55' : border + '33',
    borderBottomWidth: 2.2,
    borderBottomColor: isDark ? border + '99' : border + '77',
  };
};

// Clay Input: tactile input field with subtle inset elevation feel
export const getClayInputStyle = (isDark) => ({
  backgroundColor: isDark ? darkTheme.inputBg : lightTheme.inputBg,
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderWidth: 1.5,
  borderColor: isDark ? darkTheme.border : lightTheme.border,
  borderTopWidth: 2.5,
  borderTopColor: isDark ? darkTheme.clayCardShadowDark : lightTheme.clayCardShadowDark,
  shadowColor: isDark ? darkTheme.clayCardShadowDark : lightTheme.clayCardShadowDark,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
});

export default {
  lightTheme,
  darkTheme,
  typography,
  getClayCardStyle,
  getClayButtonStyle,
  getClayPillStyle,
  getClayBadgeStyle,
  getClayInputStyle,
};
