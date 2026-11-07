import React from 'react';
import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getClayBadgeStyle } from '../styles/theme';
import styles from './ItemSummary.styles';

export default function ItemSummary({ item, theme, isDark, variant = 'browse' }) {
  const isLost = item.type?.toLowerCase() === 'lost';
  const isClaimed = ['claimed', 'resolved'].includes(String(item.status || '').toLowerCase());
  const isCompact = variant === 'home';
  const isReport = variant === 'report';
  const badgeLabel = isClaimed ? 'CLAIMED' : isLost ? 'LOST' : 'FOUND';
  const imageStyle = [styles.image, isCompact && styles.compactImage, isReport && styles.reportImage];
  const placeholderStyle = [styles.placeholder, isCompact && styles.compactPlaceholder, isReport && styles.reportPlaceholder];

  return (
    <View style={styles.row}>
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={imageStyle} resizeMode="cover" />
      ) : (
        <View style={[placeholderStyle, { backgroundColor: isLost ? theme.accentBg : theme.successBg }]}>
          <Ionicons
            name={isLost ? 'search-outline' : 'gift-outline'}
            size={22}
            color={isLost ? theme.accent : theme.success}
          />
        </View>
      )}

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.textPrimary }]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={getClayBadgeStyle(isDark, isClaimed ? 'Found' : item.type)}>
            <Text style={[styles.badgeText, { color: isClaimed || !isLost ? theme.success : theme.accent }]}>
              {badgeLabel}
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={theme.textSecondary} style={{ marginRight: 4 }} />
          <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        {!isReport ? (
          <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={isCompact ? 1 : 2}>
            {item.description || 'No description provided.'}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
