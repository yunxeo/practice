import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../../components/SearchBar';
import { ProfessorCard } from '../../components/ProfessorCard';
import { UniversityCard } from '../../components/UniversityCard';
import { useSearchProfessors } from '../../hooks/useProfessors';
import { useSearchUniversities } from '../../hooks/useUniversities';
import { Colors, Spacing } from '../../utils/colors';
import { useDebounce } from '../../hooks/useDebounce';

type TabType = 'professors' | 'universities';

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('professors');
  const [query, setQuery] = useState('');
  const debouncedQ = useDebounce(query, 400);

  const professorsQuery = useSearchProfessors({ q: debouncedQ || undefined });
  const universitiesQuery = useSearchUniversities(debouncedQ);

  const professors = professorsQuery.data?.pages.flatMap((p) => p.data) ?? [];
  const universities = universitiesQuery.data?.pages.flatMap((p) => p.data) ?? [];

  const isLoading =
    activeTab === 'professors' ? professorsQuery.isFetching : universitiesQuery.isFetching;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>교수 찾아보기</Text>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={activeTab === 'professors' ? '교수명으로 찾아보세요' : '학교 이름으로 찾아보세요'}
          loading={isLoading}
          style={styles.searchBar}
        />
        <View style={styles.tabs}>
          {(['professors', 'universities'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'professors' ? '교수' : '대학교'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {activeTab === 'professors' ? (
        <FlatList
          data={professors}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <ProfessorCard
              professor={item}
              onPress={() => router.push(`/professor/${item.id}`)}
              style={styles.card}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          onEndReached={() => professorsQuery.hasNextPage && professorsQuery.fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={!isLoading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
              <Text style={styles.emptyDesc}>교수명이나 과목명을 다시 확인해 보세요.</Text>
            </View>
          ) : null}
          ListFooterComponent={professorsQuery.isFetchingNextPage ? <ActivityIndicator color={Colors.primary} style={{ padding: Spacing.md }} /> : null}
        />
      ) : (
        <FlatList
          data={universities}
          keyExtractor={(u) => u.id}
          renderItem={({ item }) => (
            <UniversityCard
              university={item as ReturnType<typeof universities>[number] & { location?: string; professorCount?: number }}
              onPress={() => router.push(`/university/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListEmptyComponent={!isLoading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
              <Text style={styles.emptyDesc}>학교 이름을 다시 확인해 보세요.</Text>
            </View>
          ) : null}
          ListFooterComponent={universitiesQuery.isFetchingNextPage ? <ActivityIndicator color={Colors.primary} style={{ padding: Spacing.md }} /> : null}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerSection: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: Spacing.md, paddingHorizontal: Spacing.sm },
  searchBar: { marginBottom: Spacing.sm },
  tabs: { flexDirection: 'row', gap: 4, marginBottom: Spacing.md },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.surface, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.textInverse },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  card: {},
  emptyWrap: { alignItems: 'center', marginTop: Spacing.xxl, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 6, textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
