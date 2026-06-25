import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '../../utils/colors';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, leftIcon, rightIcon, onRightIconPress, containerStyle, style, secureTextEntry, ...rest }: Props) {
  const [secure, setSecure] = useState(secureTextEntry ?? false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error && styles.inputError]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={18} color={Colors.textSecondary} style={styles.leftIcon} />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.inputWithLeft, style]}
          placeholderTextColor={Colors.textTertiary}
          secureTextEntry={secure}
          autoCapitalize="none"
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.rightIcon}>
            <Ionicons name={secure ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '500', color: Colors.text, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    minHeight: 48,
  },
  inputError: { borderColor: Colors.error },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
  },
  inputWithLeft: { paddingLeft: Spacing.xs },
  leftIcon: { marginLeft: Spacing.md },
  rightIcon: { padding: Spacing.md },
  errorText: { fontSize: 12, color: Colors.error, marginTop: 4 },
});
