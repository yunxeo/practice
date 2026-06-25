import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Card } from './ui/Card';
import { StarRating } from './ui/StarRating';
import { TagChip } from './ui/TagChip';
import { Avatar } from './ui/Avatar';
import { ProfessorSummary } from '../types';
import { Colors, Spacing } from '../utils/colors';
import { formatRating, getRatingColor } from '../utils/formatters';

interface Props {
  professor: ProfessorSummary;
  onPress: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

export function ProfessorCard({ professor, onPress, compact, style }: Props) {
  return (
    <Card onPress={onPress} style={style}>
      <View style={styles.row}>
        <Avatar
          uri={professor.photoUrl}
          fallbackText={professor.name}
          size={compact ? 44 : 56}
        />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{professor.name}</Text>
            {professor.position && (
              <Text style={styles.position}>{professor.position}</Text>
            )}
          </View>
          {professor.department && (
            <Text style={styles.department} numberOfLines={1}>
              {professor.university.name} · {professor.department.name}
            </Text>
          )}
          <View style={styles.ratingRow}>
            <StarRating value={professor.avgRating} size={14} />
            <Text style={[styles.ratingNum, { color: getRatingColor(professor.avgRating) }]}>
              {formatRating(professor.avgRating)}
            </Text>
            <Text style={styles.reviewCount}>({professor.reviewCount}개)</Text>
          </View>
        </View>
      </View>
      {!compact && professor.topTags.length > 0 && (
        <View style={styles.tags}>
          {professor.topTags.slice(0, 3).map((tag) => (
            <TagChip key={tag} label={tag} style={styles.tag} />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  name: { fontSize: 16, fontWeight: '700', color: Colors.text },
  position: { fontSize: 12, color: Colors.textSecondary, backgroundColor: Colors.border, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 4 },
  department: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingNum: { fontSize: 13, fontWeight: '700' },
  reviewCount: { fontSize: 12, color: Colors.textTertiary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.sm },
  tag: {},
});
