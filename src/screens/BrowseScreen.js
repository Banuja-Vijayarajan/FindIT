import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getActiveItems, getActiveItemsByCategory } from '../database/db';
import {
  getClayCardStyle,
  getClayPillStyle,
} from '../styles/theme';
import { ITEM_CATEGORIES } from '../constants/itemCategories';
import CategoryPillList from '../components/CategoryPillList';
import ItemSummary from '../components/ItemSummary';
import styles from '../styles/screens/BrowseScreenStyles';

export default function BrowseScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const [filter, setFilter] = useState(route.params?.initialFilter || 'All');
  const [categoryFilter, setCategoryFilter] = useState(route.params?.categoryFilter || 'All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (route.params?.categoryFilter) {
      setCategoryFilter(route.params.categoryFilter);
    }
  }, [route.params?.categoryFilter]);

  useFocusEffect(
    useCallback(() => {
      try {
        setItems(
          categoryFilter === 'All'
            ? getActiveItems()
            : getActiveItemsByCategory(categoryFilter)
        );
      } catch (error) {
        console.log('Error loading browse items:', error);
        setItems([]);
      }
    }, [categoryFilter])
  );

  const displayedItems = items.filter((item) => {
    if (String(item.status || 'active').toLowerCase() !== 'active') return false;
    const matchesFilter =
      filter === 'All' || item.type?.toLowerCase() === filter.toLowerCase();
    const matchesCategory =
      categoryFilter === 'All' || item.category === categoryFilter;
    const q = search.toLowerCase().trim();
    if (!q) return matchesFilter && matchesCategory;

    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q));

    return matchesFilter && matchesCategory && matchesSearch;
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

      <View style={styles.categoryFilters}>
        <CategoryPillList
          label="CATEGORY"
          categories={['All', ...ITEM_CATEGORIES]}
          selected={categoryFilter}
          onSelect={setCategoryFilter}
          theme={theme}
          isDark={isDark}
          contentContainerStyle={styles.categoryFilterRow}
        />
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
            <Text style={[styles.emptyTitle, { color: theme.textHeading }]}>No matching items found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Try adjusting your search terms or filter.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={[styles.card, clayCard]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ItemDetails', { item })}
            >
              <ItemSummary item={item} theme={theme} isDark={isDark} variant="browse" />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

