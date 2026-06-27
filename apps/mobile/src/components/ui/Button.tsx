import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../utils/colors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function Button({ label, onPress, variant = 'primary', size = 'md', loading, disabled, style, labelStyle }: Props) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], styles[`size_${size}`], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : Colors.primary} size="small" />
      ) : (
        <Text style={[styles.label, labelStyles[variant], labelSizeStyles[size], labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  primary: { backgroundColor: Colors.primary } as ViewStyle,
  secondary: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.primary } as ViewStyle,
  ghost: { backgroundColor: 'transparent' } as ViewStyle,
  danger: { backgroundColor: Colors.error } as ViewStyle,
  disabled: { opacity: 0.5 } as ViewStyle,
  size_sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md } as ViewStyle,
  size_md: { paddingVertical: 12, paddingHorizontal: Spacing.lg } as ViewStyle,
  size_lg: { paddingVertical: 16, paddingHorizontal: Spacing.xl } as ViewStyle,
  label: { fontWeight: '600' } as TextStyle,
});

const labelStyles: Record<Variant, TextStyle> = {
  primary: { color: Colors.textInverse },
  secondary: { color: Colors.primary },
  ghost: { color: Colors.primary },
  danger: { color: Colors.textInverse },
};

const labelSizeStyles: Record<Size, TextStyle> = {
  sm: { fontSize: 13 },
  md: { fontSize: 15 },
  lg: { fontSize: 17 },
};
