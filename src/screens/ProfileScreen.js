import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { getItems } from '../database/db';
import {
  getClayCardStyle,
  getClayInputStyle,
  getClayButtonStyle,
} from '../styles/theme';
import styles from '../styles/screens/ProfileScreenStyles';

export default function ProfileScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, updateUser } = useUser();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [studentId, setStudentId] = useState(user.studentId || '');

  const totalReports = getItems().length;

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Name and Email are required.');
      return;
    }
    updateUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      studentId: studentId.trim(),
    });
    Alert.alert('Profile Updated', 'Your account details have been saved successfully!');
  };

  const clayCard = getClayCardStyle(isDark);
  const clayInput = getClayInputStyle(isDark);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Clay Avatar Header */}
      <View style={[styles.avatarCard, clayCard]}>
        <View style={[styles.avatarCircle, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarInitial}>
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={[styles.userName, { color: theme.textPrimary }]}>{name || 'User'}</Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{email}</Text>

        <View style={[styles.statsBadge, { backgroundColor: theme.primary + '18' }]}>
          <Ionicons name="documents-outline" size={16} color={theme.primary} />
          <Text style={[styles.statsText, { color: theme.primary }]}>
            {totalReports} Items in Community
          </Text>
        </View>
      </View>

      {/* Clay Appearance Setting Card */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
        APPEARANCE
      </Text>
      <View style={[styles.card, clayCard]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={22}
              color={isDark ? theme.accent : '#F59E0B'}
            />
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {isDark ? 'Dark Theme' : 'Light Theme'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Clay Account Details Form Card */}
      <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
        ACCOUNT DETAILS
      </Text>
      <View style={[styles.card, clayCard]}>
        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
        <View style={[styles.inputRow, clayInput]}>
          <Ionicons name="person-outline" size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email Address</Text>
        <View style={[styles.inputRow, clayInput]}>
          <Ionicons name="mail-outline" size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="name@campus.edu"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Phone Number</Text>
        <View style={[styles.inputRow, clayInput]}>
          <Ionicons name="call-outline" size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="555-0199"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Student / Member ID</Text>
        <View style={[styles.inputRow, clayInput]}>
          <Ionicons name="id-card-outline" size={18} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            value={studentId}
            onChangeText={setStudentId}
            placeholder="e.g. MCC-2026-44"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            getClayButtonStyle(isDark, theme.primary),
          ]}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Ionicons name="save-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

