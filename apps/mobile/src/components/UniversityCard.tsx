import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { Colors, Spacing } from '../utils/colors';
import { UniversitySummary } from '../types';

interface Props {
  university: UniversitySummary & { location?: string | null; professorCount?: number };
  onPress: () => void;
}

export function UniversityCard({ university, onPress }: Props) {
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        {university.logoUrl ? (
          <Image source={{ uri: university.logoUrl }} style={styles.logo} resizeMode="contain" />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={styles.logoText}>{university.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{university.name}</Text>
          {university.location && (
            <Text style={styles.meta}>{university.location}</Text>
          )}
          {university.professorCount !== undefined && (
            <Text style={styles.count}>교수 {university.professorCount.toLocaleString()}명</Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  logo: { width: 48, height: 48, borderRadius: 8 },
  logoFallback: { backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: Colors.text },
  meta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  count: { fontSize: 12, color: Colors.primary, marginTop: 2 },
});
