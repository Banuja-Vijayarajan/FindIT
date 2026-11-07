import React, { useState } from 'react';
import {
  Alert,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
  getClayCardStyle,
  getClayBadgeStyle,
  getClayPillStyle,
  getClayButtonStyle,
} from '../styles/theme';
import { deleteItem, markItemAsClaimed } from '../database/db';
import styles from '../styles/screens/ItemDetailsScreenStyles';

export default function ItemDetailsScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const item = route.params?.item;
  const [status, setStatus] = useState(item?.status || 'active');

  const clayCard = getClayCardStyle(isDark);

  if (!item) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <View style={[styles.emptyBox, clayCard]}>
          <Ionicons name="alert-circle-outline" size={48} color={theme.textSecondary} style={{ marginBottom: 8 }} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No item details found.</Text>
          <TouchableOpacity
            style={[styles.backBtn, getClayPillStyle(isDark, theme.primary, true)]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isLost = item.type?.toLowerCase() === 'lost';
  const normalizedStatus = String(status).toLowerCase();
  const isClaimed = normalizedStatus === 'claimed';
  const isResolved = isClaimed || normalizedStatus === 'resolved';

  const handleResolve = () => {
    Alert.alert(
      'Mark as Claimed / Returned',
      'Has this item been successfully returned to its owner?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Mark Resolved',
          onPress: () => {
            try {
              if (!markItemAsClaimed(item.id)) {
                Alert.alert('Update Failed', 'This item could not be marked as resolved. Please try again.');
                return;
              }
              setStatus('claimed');
              Alert.alert('Item Claimed / Returned', 'This report has been marked as claimed / returned.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.log('Error resolving item:', error);
              Alert.alert('Update Failed', 'This item could not be marked as resolved. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Report',
      `Are you sure you want to permanently delete "${item.title || 'this item'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            try {
              if (!deleteItem(item.id)) {
                Alert.alert('Delete Failed', 'This report could not be deleted. Please try again.');
                return;
              }
              navigation.goBack();
            } catch (error) {
              console.log('Error deleting item:', error);
              Alert.alert('Delete Failed', 'This report could not be deleted. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Clay Details Card */}
      <View style={[styles.card, clayCard]}>
        {/* Large Item Photo if available */}
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.bannerImage} resizeMode="cover" />
        ) : null}

        <View style={styles.cardPadding}>
          {/* Status Badge & Date */}
          <View style={styles.badgeRow}>
            <View style={styles.badgeGroup}>
              <View style={getClayBadgeStyle(isDark, item.type)}>
                <View style={styles.badgeContent}>
                  <Ionicons
                    name={isLost ? 'search' : 'gift'}
                    size={14}
                    color={isLost ? theme.accent : theme.success}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      { color: isLost ? theme.accent : theme.success },
                    ]}
                  >
                    {isLost ? 'LOST ITEM' : 'FOUND ITEM'}
                  </Text>
                </View>
              </View>
              {isResolved ? (
                <View style={getClayBadgeStyle(isDark, 'Found')}>
                  <Text style={[styles.badgeText, { color: theme.success }]}>
                    {isClaimed ? 'CLAIMED' : 'RESOLVED'}
                  </Text>
                </View>
              ) : null}
            </View>

            {item.date ? (
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={13} color={theme.textSecondary} style={{ marginRight: 4 }} />
                <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.date}</Text>
              </View>
            ) : null}
          </View>

          {/* Title */}
          <Text style={[styles.title, theme.typography.h1, { color: theme.textHeading }]}>{item.title}</Text>

          {/* Location */}
          <View style={[styles.infoRow, { borderColor: theme.border }]}>
            <View style={[styles.infoIconCircle, { backgroundColor: theme.primary + '18' }]}>
              <Ionicons name="location-outline" size={18} color={theme.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Location</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{item.location}</Text>
            </View>
          </View>

          {/* Contact */}
          <View style={[styles.infoRow, { borderColor: theme.border }]}>
            <View style={[styles.infoIconCircle, { backgroundColor: theme.primary + '18' }]}>
              <Ionicons name="call-outline" size={18} color={theme.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Contact Information</Text>
              <Text style={[styles.infoValue, { color: theme.textPrimary }]}>{item.contact}</Text>
            </View>
          </View>

          {/* Description */}
          <View
            style={[
              styles.descContainer,
              {
                borderColor: theme.border,
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
              },
            ]}
          >
            <Text style={[styles.descLabel, { color: theme.textSecondary }]}>Description & Notes</Text>
            <Text style={[styles.descText, { color: theme.textPrimary }]}>
              {item.description || 'No detailed description was provided for this item.'}
            </Text>
          </View>
        </View>
      </View>

      {isResolved ? (
        <View style={[styles.resolvedNotice, { backgroundColor: theme.successBg }]}>
          <Ionicons name="checkmark-circle" size={20} color={theme.success} />
          <Text style={[styles.resolvedNoticeText, { color: theme.success }]}>This item has been resolved.</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.actionButton, getClayButtonStyle(isDark, theme.primary)]}
          onPress={handleResolve}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Ionicons name="checkmark-done-outline" size={20} color="#FFFFFF" style={styles.actionIcon} />
          <Text style={styles.primaryActionText}>Mark as Claimed / Returned</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.deleteButton, getClayPillStyle(isDark, theme.dangerBg)]}
        onPress={handleDelete}
        activeOpacity={0.8}
        accessibilityRole="button"
      >
        <Ionicons name="trash-outline" size={18} color={theme.danger} style={styles.actionIcon} />
        <Text style={[styles.deleteActionText, { color: theme.danger }]}>Delete Report</Text>
      </TouchableOpacity>

      {/* Clay Back Button */}
      <TouchableOpacity
        style={[styles.backToBrowseBtn, getClayPillStyle(isDark, theme.surface)]}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back-outline" size={18} color={theme.textPrimary} style={{ marginRight: 8 }} />
        <Text style={[styles.backToBrowseText, { color: theme.textPrimary }]}>
          Back to Browse
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

