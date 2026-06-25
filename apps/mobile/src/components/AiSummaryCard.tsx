import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';
import { Colors, Spacing } from '../utils/colors';

interface Props {
  summary: string | null;
  loading?: boolean;
  updatedAt?: string | null;
}

export function AiSummaryCard({ summary, loading, updatedAt }: Props) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={16} color={Colors.primary} />
        </View>
        <Text style={styles.title}>AI 요약</Text>
        {updatedAt && (
          <Text style={styles.updated}>
            {new Date(updatedAt).toLocaleDateString('ko-KR')} 기준
          </Text>
        )}
      </View>
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : (
        <Text style={styles.summary}>{summary ?? 'AI 요약을 불러오는 중입니다...'}</Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 13, fontWeight: '600', color: Colors.primary, flex: 1 },
  updated: { fontSize: 11, color: Colors.textTertiary },
  loader: { marginVertical: Spacing.md },
  summary: { fontSize: 14, color: Colors.text, lineHeight: 21 },
});
