import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getItems, deleteItem } from '../database/db';
import {
  getClayCardStyle,
  getClayBadgeStyle,
  getClayButtonStyle,
} from '../styles/theme';

export default function MyReportsScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const [reports, setReports] = useState([]);

  const loadReports = useCallback(() => {
    setReports(getItems());
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const handleDelete = (id, title) => {
    Alert.alert(
      'Delete Report',
      `Are you sure you want to delete "${title || 'this item'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              if (!deleteItem(id)) {
                Alert.alert('Delete Failed', 'This report could not be deleted. Please try again.');
                return;
              }
              loadReports();
            } catch (error) {
              console.log('Error deleting report:', error);
              Alert.alert('Delete Failed', 'This report could not be deleted. Please try again.');
            }
          },
        },
      ]
    );
  };

  const clayCard = getClayCardStyle(isDark);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, clayCard]}>
            <Ionicons name="documents-outline" size={48} color={theme.textSecondary} style={{ marginBottom: 10 }} />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No reports found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              You haven't posted any lost or found items yet.
            </Text>
            <TouchableOpacity
              style={[
                styles.createBtn,
                getClayButtonStyle(isDark, theme.primary),
              ]}
              onPress={() => navigation.navigate('AddReport')}
            >
              <Text style={styles.createBtnText}>+ Create a Report</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const isLost = item.type?.toLowerCase() === 'lost';
          const status = String(item.status || 'active').toLowerCase();
          const isResolved = status === 'resolved' || status === 'claimed';
          return (
            <View style={[styles.card, clayCard, isResolved && styles.resolvedCard]}>
              <TouchableOpacity
                style={styles.cardContent}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('ItemDetails', { item })}
              >
                {/* Optional Image Thumbnail */}
                {item.imageUri ? (
                  <Image source={{ uri: item.imageUri }} style={styles.thumb} />
                ) : (
                  <View style={[styles.thumbPlaceholder, { backgroundColor: isLost ? theme.accentBg : theme.successBg }]}>
                    <Ionicons
                      name={isLost ? 'search-outline' : 'gift-outline'}
                      size={22}
                      color={isLost ? theme.accent : theme.success}
                    />
                  </View>
                )}

                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
                      {item.title}
                    </Text>

                    {/* Clay Status Badge */}
                    <View style={getClayBadgeStyle(isDark, isResolved ? 'Found' : item.type)}>
                      <Text
                        style={[
                          styles.badgeText,
                          { color: isResolved || !isLost ? theme.success : theme.accent },
                        ]}
                      >
                        {isResolved ? 'CLAIMED' : isLost ? 'LOST' : 'FOUND'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={13} color={theme.textSecondary} style={{ marginRight: 3 }} />
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                      {item.location}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Clay Delete Button */}
              <TouchableOpacity
                style={[
                  styles.deleteBtn,
                  getClayButtonStyle(isDark, theme.dangerBg),
                ]}
                activeOpacity={0.7}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Ionicons name="trash-outline" size={18} color={theme.danger} />
              </TouchableOpacity>
            </View>
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
  listContent: {
    padding: 16,
    paddingBottom: 36,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    padding: 14,
  },
  resolvedCard: {
    opacity: 0.78,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
    marginRight: 12,
  },
  thumbPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
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
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    marginBottom: 18,
    textAlign: 'center',
  },
  createBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
