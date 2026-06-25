import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils/colors';

interface Props {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function StarRating({ value, max = 5, onChange, size = 20, color = Colors.star, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;

        return (
          <TouchableOpacity
            key={i}
            onPress={() => onChange?.(i + 1)}
            disabled={!onChange}
            activeOpacity={0.7}
          >
            <Ionicons
              name={filled ? 'star' : half ? 'star-half' : 'star-outline'}
              size={size}
              color={filled || half ? color : Colors.starEmpty}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
});
