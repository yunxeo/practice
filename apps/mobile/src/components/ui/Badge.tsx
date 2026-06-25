import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius } from '../../utils/colors';

interface Props {
  label: string;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export function Badge({ label, color = Colors.primaryLight, textColor = Colors.primary, style }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 12, fontWeight: '500' },
});
