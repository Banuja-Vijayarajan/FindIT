import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ItemSummary from '../components/ItemSummary';
import styles from '../styles/screens/MyReportsScreenStyles';
import { getItems, deleteItem } from '../database/db';
import {
  getClayCardStyle,
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
          const status = String(item.status || 'active').toLowerCase();
          const isResolved = status === 'resolved' || status === 'claimed';
          return (
            <View style={[styles.card, clayCard, isResolved && styles.resolvedCard]}>
              <TouchableOpacity
                style={styles.cardContent}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('ItemDetails', { item })}
              >
                <ItemSummary item={item} theme={theme} isDark={isDark} variant="report" />
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

