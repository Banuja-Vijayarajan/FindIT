import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { addItem } from '../database/db';
import {
  getClayCardStyle,
  getClayInputStyle,
  getClayButtonStyle,
} from '../styles/theme';

export default function AddReportScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const { user } = useUser();

  const [type, setType] = useState(route.params?.type || 'Lost');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState(user.phone || user.email || '');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');

  // Update type whenever screen receives new params
  useEffect(() => {
    if (route.params?.type) {
      setType(route.params.type);
    }
  }, [route.params?.type]);

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'Camera roll permission is required to add photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error picking image:', err);
      Alert.alert('Error', 'Could not open image library.');
    }
  };

  const handleSave = () => {
    if (!title.trim() || !location.trim() || !contact.trim()) {
      Alert.alert('Required Fields', 'Please fill in Item Name, Location, and Contact info.');
      return;
    }

    addItem({
      title: title.trim(),
      location: location.trim(),
      type,
      contact: contact.trim(),
      description: description.trim(),
      imageUri,
    });

    Alert.alert('Success', `${type} item reported successfully!`);
    navigation.navigate('Browse');
  };

  const isLost = type.toLowerCase() === 'lost';
  const clayCard = getClayCardStyle(isDark);
  const clayInput = getClayInputStyle(isDark);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.heading, { color: theme.textPrimary }]}>
        Report {type} Item
      </Text>

      {/* Clay Type Toggle Buttons */}
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[
            styles.typeBtn,
            getClayButtonStyle(
              isDark,
              isLost ? theme.accent : (isDark ? '#1E293B' : '#E2E8F0'),
              false
            ),
          ]}
          activeOpacity={0.8}
          onPress={() => setType('Lost')}
        >
          <Ionicons
            name="search"
            size={18}
            color={isLost ? '#FFFFFF' : theme.textSecondary}
          />
          <Text style={[styles.typeBtnText, { color: isLost ? '#FFFFFF' : theme.textSecondary }]}>
            I Lost This
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeBtn,
            getClayButtonStyle(
              isDark,
              !isLost ? theme.success : (isDark ? '#1E293B' : '#E2E8F0'),
              false
            ),
          ]}
          activeOpacity={0.8}
          onPress={() => setType('Found')}
        >
          <Ionicons
            name="gift-outline"
            size={18}
            color={!isLost ? '#FFFFFF' : theme.textSecondary}
          />
          <Text style={[styles.typeBtnText, { color: !isLost ? '#FFFFFF' : theme.textSecondary }]}>
            I Found This
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clay Form Container Card */}
      <View style={[styles.card, clayCard]}>
        {/* Item Title */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>Item Name *</Text>
        <TextInput
          style={[styles.input, clayInput, { color: theme.textPrimary }]}
          placeholder="e.g. Blue Backpack, iPhone 12, Keys"
          placeholderTextColor={theme.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        {/* Location */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>Location *</Text>
        <TextInput
          style={[styles.input, clayInput, { color: theme.textPrimary }]}
          placeholder={isLost ? 'Where was it lost?' : 'Where was it found?'}
          placeholderTextColor={theme.textSecondary}
          value={location}
          onChangeText={setLocation}
        />

        {/* Contact */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>Contact Information *</Text>
        <TextInput
          style={[styles.input, clayInput, { color: theme.textPrimary }]}
          placeholder="Phone number or email"
          placeholderTextColor={theme.textSecondary}
          value={contact}
          onChangeText={setContact}
        />

        {/* Description */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, clayInput, { color: theme.textPrimary }]}
          placeholder="Any identifying details, colors, or marks..."
          placeholderTextColor={theme.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Image Attachment (Optional) */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Item Photo (Optional)
        </Text>

        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageBtn}
              onPress={() => setImageUri('')}
            >
              <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
              <Text style={styles.removeImageText}>Remove Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.uploadBox,
              clayInput,
              { borderStyle: 'dashed', borderWidth: 1.8, borderColor: theme.primary },
            ]}
            activeOpacity={0.7}
            onPress={pickImage}
          >
            <Ionicons name="camera-outline" size={32} color={theme.primary} />
            <Text style={[styles.uploadTitle, { color: theme.primary }]}>
              Attach a Photo
            </Text>
            <Text style={[styles.uploadSubtitle, { color: theme.textSecondary }]}>
              Helps others quickly identify the item
            </Text>
          </TouchableOpacity>
        )}

        {/* Clay Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            getClayButtonStyle(isDark, isLost ? theme.accent : theme.success),
          ]}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.submitBtnText}>Submit {type} Report</Text>
        </TouchableOpacity>
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
  heading: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  card: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    marginBottom: 6,
  },
  textArea: {
    height: 85,
    textAlignVertical: 'top',
  },
  uploadBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    marginTop: 4,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 6,
  },
  uploadSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  imagePreviewContainer: {
    marginTop: 6,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 190,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
  },
  removeImageBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
