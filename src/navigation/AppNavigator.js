import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import AddReportScreen from '../screens/AddReportScreen';
import MyReportsScreen from '../screens/MyReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ItemDetailsScreen from '../screens/ItemDetailsScreen';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Header Right Action Icons at the edge of the navigation bar
function NavBarEdgeActions({ navigation }) {
  const { isDark, theme, toggleTheme } = useTheme();

  return (
    <View style={styles.edgeContainer}>
      {/* 1. Theme toggle icon */}
      <TouchableOpacity
        onPress={toggleTheme}
        style={styles.navBarIconBtn}
        activeOpacity={0.7}
        accessibilityLabel="Toggle Dark/Light Mode"
      >
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={21}
          color={theme.textHeading}
        />
      </TouchableOpacity>

      {/* 2. User profile icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={styles.navBarIconBtn}
        activeOpacity={0.7}
        accessibilityLabel="Open User Profile"
      >
        <Ionicons
          name="person-circle-outline"
          size={26}
          color={theme.textHeading}
        />
      </TouchableOpacity>
    </View>
  );
}

// Bottom Tab Navigation Bar
function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: theme.clayCardBg, height: 76 },
        headerTintColor: theme.textHeading,
        headerTitleStyle: {
          fontFamily: theme.typography.subtitle.fontFamily,
          fontWeight: '600',
          color: theme.textHeading,
        },
        headerRight: () => <NavBarEdgeActions navigation={navigation} />,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 64 }}>
              <Image
                source={require('../../assets/FindIt_logo_mark.png')}
                style={{ width: 56, height: 56, tintColor: theme.textHeading }}
                resizeMode="contain"
              />
              <Text
                style={[
                  theme.typography.appTitle,
                  { color: theme.textHeading, fontSize: 22, fontWeight: '800' },
                ]}
              >
                FindIt
              </Text>
            </View>
          ),
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          title: 'Browse Items',
          tabBarLabel: 'Browse',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'search' : 'search-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddReport"
        component={AddReportScreen}
        options={{
          title: 'Report Item',
          tabBarLabel: 'Report',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size + 4}
              color={theme.primary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          title: 'My Reports',
          tabBarLabel: 'My Reports',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'newspaper' : 'newspaper-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Account',
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator
export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: theme.clayCardBg },
          headerTintColor: theme.textHeading,
          headerTitleStyle: {
            fontFamily: theme.typography.subtitle.fontFamily,
            fontWeight: '600',
            color: theme.textHeading,
          },
          contentStyle: { backgroundColor: theme.background },
          headerRight: () => <NavBarEdgeActions navigation={navigation} />,
        })}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ItemDetails"
          component={ItemDetailsScreen}
          options={{ title: 'Item Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  edgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 8,
  },
  navBarIconBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
