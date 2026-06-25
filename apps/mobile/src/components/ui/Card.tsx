import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../../utils/colors';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, onPress, style, padding = Spacing.md }: Props) {
  const content = <View style={[styles.card, { padding }, style]}>{children}</View>;

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
});
