import React from 'react';
import { View, TextInput, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../utils/colors';

interface Props {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  loading?: boolean;
  style?: ViewStyle;
}

export function SearchBar({ value, onChange, placeholder = '교수 또는 학교 검색', loading, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {loading && <ActivityIndicator size="small" color={Colors.primary} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
});
