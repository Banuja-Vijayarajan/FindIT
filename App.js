import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_800ExtraBold } from '@expo-google-fonts/poppins/800ExtraBold';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { UserProvider } from './src/context/UserContext';
import { initDatabase } from './src/database/db';

function MainApp() {
  const { isDark, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_800ExtraBold,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    // Initialize the SQLite database when the app starts
    initDatabase();
  }, []);

  useEffect(() => {
    if (fontError) {
      console.warn('Could not load Poppins fonts:', fontError);
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading FindIt...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <ThemeProvider>
        <UserProvider>
          <MainApp />
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    color: '#4F46E5',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
  },
});
