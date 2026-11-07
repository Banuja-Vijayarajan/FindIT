import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { getItems } from '../database/db';
import {
  getClayCardStyle,
  getClayPillStyle,
  getClayBadgeStyle,
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
  const clayPill = getClayPillStyle(isDark);

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
        <Text style={[styles.greetingName, theme.typography.h1, { color: theme.textPrimary }]}>
          {user.name || 'Friend'} 
        </Text>
      </View>

      {/* 2. Clay Hero Search Card */}
      <View
        style={[
          styles.heroCard,
          getClayCardStyle(isDark, theme.primary),
          { borderBottomColor: isDark ? '#3730A3' : '#312E81' },
        ]}
      >
        <Text style={[styles.heroTitle, theme.typography.h1]}>Trust & Recover</Text>
        <Text style={[styles.heroSubtitle, theme.typography.subtitle]}>
          Secure search and seamless recovery for campus lost and found.
        </Text>

        <TouchableOpacity
          style={[styles.searchBarClay, getClayPillStyle(isDark, '#FFFFFF')]}
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
      <Text style={[styles.sectionTitle, theme.typography.subtitle, { color: theme.textPrimary }]}>Quick Actions</Text>
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
      <Text style={[styles.sectionTitle, theme.typography.subtitle, { color: theme.textPrimary }]}>Categories</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            style={[styles.categoryChip, clayPill]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Browse', { categoryFilter: cat.name })}
          >
            <Ionicons name={cat.icon} size={16} color={theme.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.categoryText, { color: theme.textPrimary }]}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 6. Recent Activity Section with Clay Cards */}
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, theme.typography.subtitle, { color: theme.textPrimary }]}>Recent Activity</Text>
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
          const isLost = item.type?.toLowerCase() === 'lost';
          return (
            <TouchableOpacity
              key={item.id.toString()}
              style={[styles.itemCard, clayCard]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ItemDetails', { item })}
            >
              <View style={styles.itemRow}>
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.itemThumb} />
                ) : (
                  <View style={[styles.itemThumbPlaceholder, { backgroundColor: isLost ? theme.accentBg : theme.successBg }]}>
                    <Ionicons
                      name={isLost ? 'search-outline' : 'gift-outline'}
                      size={22}
                      color={isLost ? theme.accent : theme.success}
                    />
                  </View>
                )}

                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.title}
                    </Text>

                    {/* Clay Pill Status Badge */}
                    <View style={getClayBadgeStyle(isDark, item.type)}>
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isLost ? theme.accent : theme.success },
                        ]}
                      >
                        {isLost ? 'LOST' : 'FOUND'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={13} color={theme.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.itemLocation, { color: theme.textSecondary }]} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>

                  <Text style={[styles.itemDesc, { color: theme.textSecondary }]} numberOfLines={1}>
                    {item.description || 'No description provided.'}
                  </Text>
                </View>
              </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  greetingHeader: {
    marginBottom: 16,
    marginTop: 4,
    marginLeft: 4,
  },
  greetingSub: {
    fontSize: 13,
    fontWeight: '600',
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  heroCard: {
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 18,
    marginBottom: 16,
  },
  searchBarClay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  searchBarPlaceholder: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  statBox: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },
  actionCard: {
    flex: 1,
  },
  actionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 11,
    lineHeight: 15,
  },
  categoryScroll: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 8,
    marginBottom: 20,
    paddingLeft: 2,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '800',
  },
  itemCard: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemThumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
  },
  itemThumbPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 6,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemDesc: {
    fontSize: 12,
  },
  emptyCard: {
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
  },
  myReportsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  myReportsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  myReportsIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myReportsTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  myReportsSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '800',
  },
});
