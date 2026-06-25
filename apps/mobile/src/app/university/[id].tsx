import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProfessorCard } from '../../components/ProfessorCard';
import { useUniversity } from '../../hooks/useUniversities';
import { useSearchProfessors } from '../../hooks/useProfessors';
import { Colors, Spacing } from '../../utils/colors';

export default function UniversityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);

  const { data: university, isLoading } = useUniversity(id);
  const { data: professorsData, fetchNextPage, hasNextPage, isFetching } = useSearchProfessors({
    universityId: id,
    departmentId: selectedDeptId ?? undefined,
  });

  const professors = professorsData?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading || !university) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={professors}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <>
            <View style={styles.backRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.heroSection}>
              <Text style={styles.uniName}>{university.name}</Text>
              {university.location && <Text style={styles.location}>{university.location}</Text>}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{university.professorCount.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>교수</Text>
                </View>
                {university.establishedYear && (
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{university.establishedYear}</Text>
                    <Text style={styles.statLabel}>설립연도</Text>
                  </View>
                )}
              </View>
            </View>

            {university.departments.length > 0 && (
              <View style={styles.deptSection}>
                <Text style={styles.sectionTitle}>학과 필터</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.deptRow}>
                  <TouchableOpacity
                    style={[styles.deptChip, !selectedDeptId && styles.deptChipActive]}
                    onPress={() => setSelectedDeptId(null)}
                  >
                    <Text style={[styles.deptChipText, !selectedDeptId && styles.deptChipTextActive]}>전체</Text>
                  </TouchableOpacity>
                  {university.departments.map((d) => (
                    <TouchableOpacity
                      key={d.id}
                      style={[styles.deptChip, selectedDeptId === d.id && styles.deptChipActive]}
                      onPress={() => setSelectedDeptId(d.id === selectedDeptId ? null : d.id)}
                    >
                      <Text style={[styles.deptChipText, selectedDeptId === d.id && styles.deptChipTextActive]}>
                        {d.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.professorHeader}>
              <Text style={styles.sectionTitle}>소속 교수</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ProfessorCard
            professor={item}
            onPress={() => router.push(`/professor/${item.id}`)}
            style={styles.card}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          isFetching ? <ActivityIndicator color={Colors.primary} style={{ padding: Spacing.md }} /> : null
        }
        ListEmptyComponent={
          !isFetching ? <Text style={styles.empty}>교수 정보가 없습니다.</Text> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  backRow: { paddingHorizontal: Spacing.sm },
  backBtn: { padding: Spacing.sm },
  heroSection: { alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
  uniName: { fontSize: 24, fontWeight: '800', color: Colors.text, textAlign: 'center' },
  location: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.md },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  deptSection: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  deptRow: { gap: 8 },
  deptChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface },
  deptChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  deptChipText: { fontSize: 13, color: Colors.textSecondary },
  deptChipTextActive: { color: Colors.textInverse },
  professorHeader: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  card: {},
  empty: { textAlign: 'center', color: Colors.textSecondary, marginTop: Spacing.xl, fontSize: 14 },
});
