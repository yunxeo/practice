import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../utils/colors';

interface Props {
  uri?: string | null;
  fallbackText?: string;
  size?: number;
  style?: ViewStyle;
}

export function Avatar({ uri, fallbackText, size = 40, style }: Props) {
  const initials = fallbackText
    ? fallbackText.charAt(0).toUpperCase()
    : '?';

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
