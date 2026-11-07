import React from 'react';
import {
  StyleSheet,
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
} from '../styles/theme';

export default function ItemDetailsScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const item = route.params?.item;

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

            {item.date ? (
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={13} color={theme.textSecondary} style={{ marginRight: 4 }} />
                <Text style={[styles.dateText, { color: theme.textSecondary }]}>{item.date}</Text>
              </View>
            ) : null}
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>{item.title}</Text>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
    width: '100%',
  },
  card: {
    overflow: 'hidden',
    marginBottom: 16,
    padding: 0,
  },
  bannerImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#E2E8F0',
  },
  cardPadding: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  infoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  descContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.2,
    marginTop: 12,
  },
  descLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descText: {
    fontSize: 14,
    lineHeight: 21,
  },
  backToBrowseBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  backToBrowseText: {
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    fontSize: 15,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
