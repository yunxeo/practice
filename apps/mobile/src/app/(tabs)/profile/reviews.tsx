import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../services/api';
import { Colors, Spacing } from '../../../utils/colors';
import { formatDate } from '../../../utils/formatters';

interface MyReview {
  id: string;
  content: string;
  rating_overall: number;
  course_name: string | null;
  semester: string | null;
  created_at: string;
  professors: { id: string; name: string; universities: { name: string } | null } | null;
}

export default function MyReviewsScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const res = await api.get<{ data: MyReview[] }>('/users/me/reviews');
      return res.data.data;
    },
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>내가 쓴 후기</Text>
        <View style={{ width: 22 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xxl }} />
      ) : (
        <FlatList
          data={data ?? []}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => item.professors && router.push(`/professor/${item.professors.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.professorName}>
                  {item.professors?.name ?? '알 수 없음'}
                </Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {item.rating_overall}</Text>
                </View>
              </View>
              {item.professors?.universities && (
                <Text style={styles.university}>{item.professors.universities.name}</Text>
              )}
              <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
              <View style={styles.footer}>
                {item.course_name && <Text style={styles.meta}>{item.course_name}</Text>}
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={<Text style={styles.empty}>작성한 후기가 없습니다.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.md, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title: { fontSize: 16, fontWeight: '700', color: Colors.text },
  list: { padding: Spacing.md },
  card: { backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  professorName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  ratingBadge: { backgroundColor: Colors.accent + '20', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  ratingText: { fontSize: 12, fontWeight: '600', color: Colors.accent },
  university: { fontSize: 12, color: Colors.textSecondary, marginBottom: Spacing.sm },
  content: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19, marginBottom: Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  meta: { fontSize: 11, color: Colors.textTertiary },
  date: { fontSize: 11, color: Colors.textTertiary },
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.xxl, fontSize: 14 },
});
