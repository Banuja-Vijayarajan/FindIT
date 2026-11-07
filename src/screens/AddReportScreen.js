import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { addItem } from '../database/db';
import {
  getClayCardStyle,
  getClayInputStyle,
  getClayButtonStyle,
  getClayPillStyle,
} from '../styles/theme';
import { ITEM_CATEGORIES } from '../constants/itemCategories';

export default function AddReportScreen({ route, navigation }) {
  const { theme, isDark } = useTheme();
  const { user } = useUser();

  const [type, setType] = useState('Lost');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [category, setCategory] = useState('');

  const resetForm = useCallback(() => {
    setType(route.params?.type || 'Lost');
    setTitle('');
    setLocation('');
    setContact(user.phone || user.email || '');
    setDescription('');
    setImageUri(null);
    setCategory('');
  }, [route.params?.type, user.email, user.phone]);

  useFocusEffect(
    useCallback(() => {
      resetForm();
      return resetForm;
    }, [resetForm])
  );

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          const guidance = permissionResult.canAskAgain
            ? 'Allow photo library access to attach an image to your report.'
            : 'Photo library access is disabled. Enable it in your device settings to attach an image.';
          Alert.alert('Photo Library Access Needed', guidance);
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error selecting report image:', err);
      Alert.alert('Unable to Choose Image', 'The photo library could not be opened. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
          const guidance = permissionResult.canAskAgain
            ? 'Allow camera access to take a photo for your report.'
            : 'Camera access is disabled. Enable it in your device settings to take a photo.';
          Alert.alert('Camera Access Needed', guidance);
          return;
        }
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      console.log('Error capturing report image:', err);
      Alert.alert('Unable to Take Photo', 'The camera could not be opened. Please try again.');
    }
  };

  const handleSave = () => {
    if (!category) {
      Alert.alert('Required Field', 'Please select an item category.');
      return;
    }

    if (!title.trim() || !location.trim() || !contact.trim()) {
      Alert.alert('Required Fields', 'Please fill in Item Name, Location, and Contact info.');
      return;
    }

    addItem({
      title: title.trim(),
      location: location.trim(),
      type,
      category,
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
      <Text style={[styles.heading, theme.typography.h1, { color: theme.textPrimary }]}>
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

        <Text style={[styles.label, { color: theme.textSecondary }]}>Category *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {ITEM_CATEGORIES.map((itemCategory) => {
            const isSelected = category === itemCategory;
            return (
              <TouchableOpacity
                key={itemCategory}
                style={[
                  styles.categoryPill,
                  getClayPillStyle(
                    isDark,
                    isSelected ? theme.primary : theme.surface,
                    isSelected
                  ),
                ]}
                onPress={() => setCategory(itemCategory)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {itemCategory}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
          <View style={[getClayCardStyle(isDark), styles.imagePreviewContainer]}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
            <TouchableOpacity
              style={[styles.removeImageBtn, { backgroundColor: theme.danger }]}
              onPress={() => setImageUri(null)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Remove selected photo"
            >
              <Ionicons name="close" size={16} color="#FFFFFF" />
              <Text style={styles.removeImageText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.photoPlaceholder, clayInput, { borderColor: theme.primary }]}>
            <Ionicons name="image-outline" size={30} color={theme.primary} />
            <Text style={[styles.uploadTitle, { color: theme.primary }]}>Add an item photo</Text>
            <Text style={[styles.uploadSubtitle, { color: theme.textSecondary }]}>
              Take a new photo or choose one from your library.
            </Text>
          </View>
        )}

        <View style={styles.photoActions}>
          <TouchableOpacity
            style={[styles.photoActionButton, getClayButtonStyle(isDark, theme.primary)]}
            activeOpacity={0.85}
            onPress={takePhoto}
            accessibilityRole="button"
          >
            <Ionicons name="camera-outline" size={20} color="#FFFFFF" style={styles.photoActionIcon} />
            <Text style={styles.photoActionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.photoActionButton, getClayButtonStyle(isDark, theme.surface)]}
            activeOpacity={0.85}
            onPress={pickImage}
            accessibilityRole="button"
          >
            <Ionicons name="images-outline" size={20} color={theme.primary} style={styles.photoActionIcon} />
            <Text style={[styles.photoActionText, { color: theme.primary }]}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>

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
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 2,
    paddingVertical: 6,
    marginBottom: 8,
  },
  categoryPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryPillText: {
    fontSize: 12,
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
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginTop: 4,
    marginBottom: 10,
    borderStyle: 'dashed',
    borderWidth: 1.8,
  },
  photoActions: {
    gap: 10,
  },
  photoActionButton: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActionIcon: {
    marginRight: 8,
  },
  photoActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
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
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    padding: 0,
  },
  imagePreview: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 16,
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
