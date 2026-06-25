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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import { ProfessorCard } from '../../components/ProfessorCard';
import { useAuthStore } from '../../stores/auth.store';
import { useSearchStore } from '../../stores/search.store';
import { useSearchProfessors } from '../../hooks/useProfessors';
import { useTheme } from '../../hooks/useTheme';
import { Colors, Spacing } from '../../utils/colors';
import { useDebounce } from '../../hooks/useDebounce';

type SearchMode = 'professor' | 'course';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { colors } = useTheme();
  const { query, setQuery, recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore();
  const [localQ, setLocalQ] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('professor');
  const debouncedQ = useDebounce(localQ, 400);

  // FR-003: 교수명/과목명 모드 전환 검색
  const { data, isFetching, fetchNextPage, hasNextPage } = useSearchProfessors({
    q: searchMode === 'professor' ? debouncedQ || undefined : undefined,
    courseName: searchMode === 'course' ? debouncedQ || undefined : undefined,
  });

  const professors = data?.pages.flatMap((p) => p.data) ?? [];

  const handleSearch = (text: string) => {
    setLocalQ(text);
    setQuery(text);
  };

  const handleProfessorPress = (id: string) => {
    if (localQ) addRecentSearch(localQ);
    router.push(`/professor/${id}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            안녕하세요, {user?.nickname ?? '학생'}님 👋
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            교수를 알면 수강이 쉬워져요
          </Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={localQ}
          onChange={handleSearch}
          placeholder={searchMode === 'professor' ? '교수명, 과목명으로 찾아보세요' : '과목명으로 찾아보세요 (운영체제, 자료구조 ...)'}
          loading={isFetching && !!localQ}
        />
        {/* FR-003: 검색 모드 토글 */}
        <View style={styles.modeRow}>
          {(['professor', 'course'] as SearchMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.modeChip,
                { borderColor: searchMode === m ? colors.primary : colors.border },
                searchMode === m && { backgroundColor: colors.primary + '15' },
              ]}
              onPress={() => { setSearchMode(m); setLocalQ(''); }}
            >
              <Ionicons
                name={m === 'professor' ? 'person-outline' : 'book-outline'}
                size={13}
                color={searchMode === m ? colors.primary : colors.textSecondary}
              />
              <Text style={[
                styles.modeChipText,
                { color: searchMode === m ? colors.primary : colors.textSecondary },
              ]}>
                {m === 'professor' ? '교수명' : '과목명'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!localQ && recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>최근 검색</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={[styles.clearBtn, { color: colors.textSecondary }]}>전체 삭제</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList}>
            {recentSearches.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.recentChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={() => handleSearch(s)}
              >
                <Text style={[styles.recentChipText, { color: colors.text }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {!localQ && (
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>높은 평점 교수</Text>
        </View>
      )}

      <FlatList
        data={professors}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <ProfessorCard
            professor={item}
            onPress={() => handleProfessorPress(item.id)}
            style={styles.professorCard}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !isFetching && localQ ? (
            <View style={styles.emptyWrap}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>검색 결과가 없어요</Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                {searchMode === 'course' ? '과목명을' : '교수명이나 과목명을'} 다시 확인해 보세요.
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={hasNextPage ? <ActivityIndicator color={Colors.primary} style={{ padding: Spacing.md }} /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.md, marginBottom: Spacing.md },
  greeting: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 2 },
  searchWrap: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  modeRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  modeChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1.5 },
  modeChipText: { fontSize: 12, fontWeight: '500' },
  recentSection: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  clearBtn: { fontSize: 13 },
  recentList: { paddingHorizontal: Spacing.sm, gap: 8 },
  recentChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  recentChipText: { fontSize: 13 },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  professorCard: {},
  emptyWrap: { alignItems: 'center', marginTop: Spacing.xxl, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
