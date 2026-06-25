import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/SearchBar';
import { UniversityCard } from '../../../components/UniversityCard';
import { useSearchUniversities } from '../../../hooks/useUniversities';
import { useAuthStore } from '../../../stores/auth.store';
import { Colors, Spacing } from '../../../utils/colors';
import { UniversitySummary } from '../../../types';
import { useDebounce } from '../../../hooks/useDebounce';

export default function RegisterUniversityScreen() {
  const params = useLocalSearchParams<{ email: string; nickname: string; password: string }>();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<UniversitySummary | null>(null);
  const [error, setError] = useState('');
  const debouncedQ = useDebounce(query, 400);
  const { register, isLoading } = useAuthStore();
  const { data, isFetching } = useSearchUniversities(debouncedQ);

  const universities = data?.pages.flatMap((p) => p.data) ?? [];

  const handleComplete = async () => {
    setError('');
    try {
      await register({
        email: params.email,
        password: params.password,
        nickname: params.nickname,
        universityId: selected?.id,
      });
      router.replace('/(tabs)');
    } catch {
      setError('가입에 실패했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← 뒤로</Text>
        </TouchableOpacity>
        <View style={styles.progressRow}>
          <View style={styles.step} />
          <View style={[styles.step, styles.stepActive]} />
        </View>
        <Text style={styles.title}>내 학교 선택하기</Text>
        <Text style={styles.subtitle}>2/2 — 재학 중인 학교를 선택해 보세요.</Text>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="학교 이름으로 찾아보세요"
          loading={isFetching}
        />
      </View>

      {selected && (
        <View style={styles.selectedBanner}>
          <Text style={styles.selectedText}>✓ {selected.name} 선택됨</Text>
          <TouchableOpacity onPress={() => setSelected(null)}>
            <Text style={styles.clearText}>해제</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={universities}
        keyExtractor={(u) => u.id}
        renderItem={({ item }) => (
          <UniversityCard
            university={item as UniversitySummary & { location?: string; professorCount?: number }}
            onPress={() => setSelected(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.footer}>
        <Button label="건너뛰기" onPress={handleComplete} variant="ghost" />
        <Button label="가입 완료하기" onPress={handleComplete} loading={isLoading} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Spacing.xl, paddingBottom: 0 },
  backText: { fontSize: 15, color: Colors.primary, marginBottom: Spacing.md },
  progressRow: { flexDirection: 'row', gap: 4, marginBottom: Spacing.xl },
  step: { flex: 1, height: 4, backgroundColor: Colors.border, borderRadius: 2 },
  stepActive: { backgroundColor: Colors.primary },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.textSecondary },
  searchWrap: { padding: Spacing.md },
  selectedBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: Spacing.md, marginBottom: Spacing.sm, backgroundColor: Colors.primary + '15', padding: Spacing.sm, borderRadius: 8 },
  selectedText: { fontSize: 13, color: Colors.primary, fontWeight: '500' },
  clearText: { fontSize: 13, color: Colors.error },
  list: { paddingHorizontal: Spacing.md },
  error: { fontSize: 13, color: Colors.error, textAlign: 'center', marginHorizontal: Spacing.xl },
  footer: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.xl },
});
