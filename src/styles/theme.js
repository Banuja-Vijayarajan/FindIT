// Theme colors configuration for FindIt app
// Light and Dark mode professional color palettes & Claymorphism style helpers

export const typography = {
  appTitle: { fontFamily: 'Poppins_800ExtraBold' },
  h1: { fontFamily: 'Poppins_800ExtraBold' },
  subtitle: { fontFamily: 'Poppins_600SemiBold' },
};

export const lightTheme = {
  background: '#F8FAFC',     // Slate Off-White
  surface: '#FFFFFF',        // Pure White (Cards/Surfaces)
  primary: '#4F46E5',        // Deep Indigo (Buttons, Headers, Active tabs)
  accent: '#D97706',         // Campus Amber ("Lost" badges & highlights)
  textPrimary: '#0F172A',    // Dark Slate
  textSecondary: '#64748B',  // Muted Grey
  border: '#E2E8F0',         // Soft border
  inputBg: '#FFFFFF',        // Input background
  success: '#10B981',        // Emerald Green ("Found" badges)
  successBg: '#DCFCE7',      // Soft Green background
  accentBg: '#FEF3C7',       // Soft Amber background
  dangerBg: '#FEE2E2',       // Soft Red background
  danger: '#EF4444',         // Red alert/delete
  isDark: false,
  typography,
};

export const darkTheme = {
  background: '#0F172A',     // Deep Charcoal
  surface: '#1E293B',        // Slate Card
  primary: '#6366F1',        // Bright Indigo (High contrast)
  accent: '#F59E0B',         // Warm Amber ("Lost" badges & highlights)
  textPrimary: '#F8FAFC',    // Light Slate
  textSecondary: '#94A3B8',  // Cool Grey
  border: '#334155',         // Muted border
  inputBg: '#0F172A',        // Dark input background
  success: '#34D399',        // Bright Green ("Found" badges)
  successBg: '#064E3B',      // Dark Green background
  accentBg: '#78350F',       // Dark Amber background
  dangerBg: '#7F1D1D',       // Dark Red background
  danger: '#F87171',         // Red alert/delete
  isDark: true,
  typography,
};

/**
 * Reusable Claymorphism (Clay UI) Style Helpers
 * Tactile inflated surfaces, soft outer elevation, perimeter highlight, and bottom extrusion
 */

// Clay Card: tactile inflated surface with soft dual shadow and extruded bottom rim
export const getClayCardStyle = (isDark, customBg = null) => ({
  backgroundColor: customBg || (isDark ? '#1E293B' : '#FFFFFF'),
  borderRadius: 22,
  padding: 18,
  // Soft outer elevation
  shadowColor: isDark ? '#000000' : '#475569',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: isDark ? 0.45 : 0.12,
  shadowRadius: 14,
  elevation: 6,
  // Clay perimeter highlight & bottom rim extrusion
  borderWidth: 1.5,
  borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.95)',
  borderBottomWidth: 3.5,
  borderBottomColor: isDark ? '#0F172A' : '#E2E8F0',
});

// Clay Button: 3D inflated button with tactile pressable feedback
export const getClayButtonStyle = (isDark, bgColor, pressed = false) => ({
  backgroundColor: bgColor,
  borderRadius: 20,
  paddingVertical: pressed ? 13 : 14,
  paddingHorizontal: 18,
  shadowColor: isDark ? '#000000' : bgColor,
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
  backgroundColor: customBg || (isDark ? '#1E293B' : '#FFFFFF'),
  shadowColor: isDark ? '#000000' : '#64748B',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: isDark ? 0.35 : 0.08,
  shadowRadius: 6,
  elevation: 3,
  borderWidth: 1.2,
  borderColor: active ? (isDark ? '#6366F1' : '#4F46E5') : (isDark ? 'rgba(255, 255, 255, 0.06)' : '#FFFFFF'),
  borderBottomWidth: 2.5,
  borderBottomColor: isDark ? '#0F172A' : '#E2E8F0',
});

// Clay Badge: pill-shaped status badge ("LOST" in Amber, "FOUND" in Emerald/Indigo)
export const getClayBadgeStyle = (isDark, type = 'lost') => {
  const isLost = type?.toLowerCase() === 'lost';
  const bg = isLost
    ? (isDark ? '#78350F' : '#FEF3C7')
    : (isDark ? '#064E3B' : '#DCFCE7');
  const border = isLost
    ? (isDark ? '#F59E0B' : '#D97706')
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
  backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
  borderRadius: 18,
  paddingHorizontal: 16,
  paddingVertical: 12,
  borderWidth: 1.5,
  borderColor: isDark ? '#334155' : '#E2E8F0',
  borderTopWidth: 2.5,
  borderTopColor: isDark ? '#020617' : '#CBD5E1',
  shadowColor: isDark ? '#000000' : '#CBD5E1',
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
