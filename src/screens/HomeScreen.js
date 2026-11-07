import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { getItems } from '../database/db';
import CategoryPillList from '../components/CategoryPillList';
import ItemSummary from '../components/ItemSummary';
import styles from '../styles/screens/HomeScreenStyles';
import {
  getClayCardStyle,
  getClayPillStyle,
} from '../styles/theme';

const CATEGORIES = [
  { name: 'Electronics', icon: 'phone-portrait-outline' },
  { name: 'Keys', icon: 'key-outline' },
  { name: 'IDs & Cards', icon: 'card-outline' },
  { name: 'Bags & Wallets', icon: 'wallet-outline' },
  { name: 'Clothing', icon: 'shirt-outline' },
  { name: 'Other', icon: 'cube-outline' },
];

export default function HomeScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const { user } = useUser();
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(() => {
    try {
      const data = getItems();
      setItems(data || []);
    } catch (e) {
      console.log('Error loading items on Home:', e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  };

  const totalCount = items.length;
  const lostCount = items.filter((i) => i.type?.toLowerCase() === 'lost').length;
  const foundCount = items.filter((i) => i.type?.toLowerCase() === 'found').length;
  const recentItems = items.slice(0, 3);

  // Reusable Clay Card helper
  const clayCard = getClayCardStyle(isDark);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* 1. Welcoming User Greeting */}
      <View style={styles.greetingHeader}>
        <Text style={[styles.greetingSub, theme.typography.subtitle, { color: theme.textSecondary }]}>
          Welcome back,
        </Text>
        <Text style={[styles.greetingName, theme.typography.h1, { color: theme.textHeading }]}>
          {user.name || 'Friend'} 
        </Text>
      </View>

      {/* 2. Clay Hero Search Card */}
      <View
        style={[
          styles.heroCard,
          getClayCardStyle(isDark, theme.primary),
          { borderBottomColor: theme.textHeading },
        ]}
      >
        <Text style={[styles.heroTitle, theme.typography.h1]}>Trust & Recover</Text>
        <Text style={[styles.heroSubtitle, theme.typography.subtitle]}>
          Secure search and seamless recovery for campus lost and found.
        </Text>

        <TouchableOpacity
          style={[styles.searchBarClay, getClayPillStyle(isDark, theme.clayCardBg)]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Browse')}
        >
          <Ionicons name="search-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <Text style={styles.searchBarPlaceholder}>Search items, locations, keys...</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Clay Live Stats Counters */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, clayCard]}>
          <Text style={[styles.statNumber, { color: theme.textPrimary }]}>{totalCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Items</Text>
        </View>

        <View style={[styles.statBox, clayCard]}>
          <Text style={[styles.statNumber, { color: theme.accent }]}>{lostCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Still Lost</Text>
        </View>

        <View style={[styles.statBox, clayCard]}>
          <Text style={[styles.statNumber, { color: theme.success }]}>{foundCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Found</Text>
        </View>
      </View>

      {/* 4. Clay Quick Action Cards */}
      <Text style={[styles.sectionTitle, theme.typography.subtitle, { color: theme.textHeading }]}>Quick Actions</Text>
      <View style={styles.actionGrid}>
        {/* Report Lost Clay Card */}
        <TouchableOpacity
          style={[
            styles.actionCard,
            getClayCardStyle(isDark, isDark ? '#271B16' : '#FFFBEB'),
            { borderBottomColor: isDark ? '#451A03' : '#FDE68A' },
          ]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddReport', { type: 'Lost' })}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: isDark ? '#78350F' : '#FEF3C7' }]}>
            <Ionicons name="search" size={24} color={theme.accent} />
          </View>
          <Text style={[styles.actionTitle, { color: theme.accent }]}>Report Lost</Text>
          <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>
            Post details to notify the community
          </Text>
        </TouchableOpacity>

        {/* Report Found Clay Card */}
        <TouchableOpacity
          style={[
            styles.actionCard,
            getClayCardStyle(isDark, isDark ? '#142721' : '#F0FDF4'),
            { borderBottomColor: isDark ? '#064E3B' : '#BBF7D0' },
          ]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('AddReport', { type: 'Found' })}
        >
          <View style={[styles.actionIconCircle, { backgroundColor: isDark ? '#064E3B' : '#DCFCE7' }]}>
            <Ionicons name="gift-outline" size={24} color={theme.success} />
          </View>
          <Text style={[styles.actionTitle, { color: theme.success }]}>Report Found</Text>
          <Text style={[styles.actionDesc, { color: theme.textSecondary }]}>
            Help safely return an item
          </Text>
        </TouchableOpacity>
      </View>

      {/* 5. Clay Category Pills Row */}
      <Text style={[styles.sectionTitle, theme.typography.subtitle, { color: theme.textHeading }]}>Categories</Text>
      <CategoryPillList
        categories={CATEGORIES}
        selected={null}
        onSelect={(category) => navigation.navigate('Browse', { categoryFilter: category })}
        theme={theme}
        isDark={isDark}
        contentContainerStyle={styles.categoryScroll}
      />

      {/* 6. Recent Activity Section with Clay Cards */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, theme.typography.subtitle, { color: theme.textHeading }]}>Recent Activity</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Browse')}>
          <Text style={[styles.seeAllText, { color: theme.primary }]}>View All ({totalCount}) →</Text>
        </TouchableOpacity>
      </View>

      {recentItems.length === 0 ? (
        <View style={[styles.emptyCard, clayCard]}>
          <Ionicons name="cube-outline" size={38} color={theme.textSecondary} style={{ marginBottom: 6 }} />
          <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No items reported yet</Text>
          <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
            Be the first to post a lost or found notice!
          </Text>
        </View>
      ) : (
        recentItems.map((item) => {
          return (
            <TouchableOpacity
              key={item.id.toString()}
              style={[styles.itemCard, clayCard]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ItemDetails', { item })}
            >
              <ItemSummary item={item} theme={theme} isDark={isDark} variant="home" />
            </TouchableOpacity>
          );
        })
      )}

      {/* 7. Clay My Reports Shortcut */}
      <TouchableOpacity
        style={[styles.myReportsCard, clayCard]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('MyReports')}
      >
        <View style={styles.myReportsLeft}>
          <View style={[styles.myReportsIconCircle, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="newspaper-outline" size={22} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.myReportsTitle, { color: theme.textPrimary }]}>My Reported Items</Text>
            <Text style={[styles.myReportsSubtitle, { color: theme.textSecondary }]}>
              Manage, edit or delete your posted items
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color={theme.textSecondary} />
      </TouchableOpacity>

      {/* 8. Clay Safety Tip Card */}
      <View
        style={[
          styles.tipCard,
          getClayCardStyle(isDark, isDark ? '#271B16' : '#FEF3C7'),
          { borderBottomColor: isDark ? '#451A03' : '#FDE68A' },
        ]}
      >
        <Ionicons name="shield-checkmark-outline" size={24} color={theme.accent} style={{ marginRight: 12 }} />
        <Text style={[styles.tipText, { color: isDark ? '#FEF3C7' : '#92400E' }]}>
          <Text style={styles.tipBold}>Safety Tip: </Text>
          Always arrange to hand over items in public, well-lit spaces like student centers or library desks.
        </Text>
      </View>
    </ScrollView>
  );
}

