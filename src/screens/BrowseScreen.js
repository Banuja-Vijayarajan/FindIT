import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getItems } from '../database/db';
import {
  getClayCardStyle,
  getClayPillStyle,
  getClayBadgeStyle,
} from '../styles/theme';

export default function BrowseScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const [filter, setFilter] = useState(route.params?.initialFilter || 'All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setItems(getItems());
    }, [])
  );

  const displayedItems = items.filter((item) => {
    const matchesFilter =
      filter === 'All' || item.type?.toLowerCase() === filter.toLowerCase();
    const q = search.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));

    return matchesFilter && matchesSearch;
  });

  const clayCard = getClayCardStyle(isDark);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Clay Search Input Bar */}
      <View
        style={[
          styles.searchBox,
          getClayPillStyle(isDark, theme.surface),
        ]}
      >
        <Ionicons name="search-outline" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
        <TextInput
          style={[styles.searchInput, { color: theme.textPrimary }]}
          placeholder="Search items, locations..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Clay Filter Tabs */}
      <View style={styles.filterRow}>
        {['All', 'Lost', 'Found'].map((tab) => {
          const isActive = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterBtn,
                getClayPillStyle(
                  isDark,
                  isActive ? theme.primary : theme.surface,
                  isActive
                ),
              ]}
              onPress={() => setFilter(tab)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isActive ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List of items */}
      <FlatList
        data={displayedItems}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, clayCard]}>
            <Ionicons name="search-outline" size={42} color={theme.textSecondary} style={{ marginBottom: 8 }} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No matching items found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Try adjusting your search terms or filter.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isLost = item.type?.toLowerCase() === 'lost';
          return (
            <TouchableOpacity
              style={[styles.card, clayCard]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ItemDetails', { item })}
            >
              <View style={styles.cardRow}>
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.cardThumb} />
                ) : (
                  <View style={[styles.cardThumbPlaceholder, { backgroundColor: isLost ? theme.accentBg : theme.successBg }]}>
                    <Ionicons
                      name={isLost ? 'search-outline' : 'gift-outline'}
                      size={22}
                      color={isLost ? theme.accent : theme.success}
                    />
                  </View>
                )}

                <View style={styles.cardDetails}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: theme.textPrimary }]} numberOfLines={1}>
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
                    <Text style={[styles.cardLocation, { color: theme.textSecondary }]} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>

                  <Text style={[styles.cardDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                    {item.description || 'No description provided'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  clearBtn: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    fontWeight: '800',
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 36,
  },
  card: {
    marginBottom: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardThumb: {
    width: 68,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
  },
  cardThumbPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetails: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
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
  cardLocation: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 44,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
