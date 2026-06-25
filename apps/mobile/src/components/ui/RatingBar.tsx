import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../utils/colors';

interface Props {
  label: string;
  value: number;
  max?: number;
  style?: ViewStyle;
}

export function RatingBar({ label, value, max = 5, style }: Props) {
  const pct = (value / max) * 100;

  return (
    <View style={[styles.row, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trackWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
      </View>
      <Text style={styles.value}>{value.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: { fontSize: 13, color: Colors.textSecondary, width: 48 },
  trackWrap: { flex: 1, marginHorizontal: Spacing.sm },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  value: { fontSize: 13, fontWeight: '600', color: Colors.text, width: 28, textAlign: 'right' },
});
