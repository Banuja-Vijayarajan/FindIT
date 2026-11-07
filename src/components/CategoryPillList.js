import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getClayPillStyle } from '../styles/theme';
import styles from './CategoryPillList.styles';

export default function CategoryPillList({
  categories,
  selected,
  onSelect,
  theme,
  isDark,
  label,
  contentContainerStyle,
}) {
  return (
    <View>
      {label ? (
        <Text style={[styles.label, { color: theme.textHeading }]}>{label}</Text>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      >
        {categories.map((option) => {
          const category = typeof option === 'string' ? option : option.name;
          const icon = typeof option === 'string' ? null : option.icon;
          const isSelected = selected === category;
          return (
            <TouchableOpacity
              key={category}
              style={[styles.pill, getClayPillStyle(isDark, isSelected ? theme.primary : theme.surface, isSelected)]}
              onPress={() => onSelect(category)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
            >
              <View style={styles.pillContent}>
                {icon ? (
                  <Ionicons
                    name={icon}
                    size={16}
                    color={isSelected ? '#FFFFFF' : theme.primary}
                    style={styles.pillIcon}
                  />
                ) : null}
                <Text style={[styles.pillText, { color: isSelected ? '#FFFFFF' : theme.textSecondary }]}>
                  {category}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
