import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { TagChip } from '../../components/ui/TagChip';
import { RatingBar } from '../../components/ui/RatingBar';
import { StarRating } from '../../components/ui/StarRating';
import { ReviewCard } from '../../components/ReviewCard';
import { AiSummaryCard } from '../../components/AiSummaryCard';
import { useProfessor, useProfessorReviews, useAiSummary } from '../../hooks/useProfessors';
import { useLikeReview, useDeleteReview } from '../../hooks/useReviews';
import { useAuthStore } from '../../stores/auth.store';
import { Colors, Spacing } from '../../utils/colors';
import { getRatingColor, formatRating } from '../../utils/formatters';

export default function ProfessorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [showAiSummary, setShowAiSummary] = useState(false);

  const { data: professor, isLoading } = useProfessor(id);
  const { data: reviewsData, fetchNextPage, hasNextPage } = useProfessorReviews(id);
  const { data: aiSummary, isLoading: aiLoading } = useAiSummary(showAiSummary ? id : '');

  const likeMutation = useLikeReview(id);
  const deleteMutation = useDeleteReview(id);

  const reviews = reviewsData?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading || !professor) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={reviews}
        keyExtractor={(r) => r.id}
        ListHeaderComponent={
          <>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={Colors.text} />
            </TouchableOpacity>

            <View style={styles.heroSection}>
              <Avatar uri={professor.photoUrl} fallbackText={professor.name} size={72} />
              <Text style={styles.name}>{professor.name}</Text>
              {professor.position && <Text style={styles.position}>{professor.position}</Text>}
              <Text style={styles.affiliation}>
                {professor.university.name}
                {professor.department && ` · ${professor.department.name}`}
              </Text>
              <View style={styles.ratingOverall}>
                <StarRating value={professor.avgRating} size={18} />
                <Text style={[styles.ratingNum, { color: getRatingColor(professor.avgRating) }]}>
                  {formatRating(professor.avgRating)}
                </Text>
                <Text style={styles.reviewCountText}>({professor.reviewCount}개)</Text>
              </View>
            </View>

            {professor.tags.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
                {professor.tags.slice(0, 8).map((tag) => (
                  <TagChip key={tag.label} label={`${tag.label} ${tag.count}`} />
                ))}
              </ScrollView>
            )}

            <View style={styles.ratingsSection}>
              <Text style={styles.sectionTitle}>📊 평점 상세</Text>
              <RatingBar label="전반" value={professor.ratings.overall} />
              <RatingBar label="난이도" value={professor.ratings.difficulty} />
              <RatingBar label="전달력" value={professor.ratings.clarity} />
              <RatingBar label="친절도" value={professor.ratings.helpfulness} />
            </View>

            {professor.bio && (
              <View style={styles.bioSection}>
                <Text style={styles.sectionTitle}>소개</Text>
                <Text style={styles.bio}>{professor.bio}</Text>
              </View>
            )}

            {professor.researchAreas.length > 0 && (
              <View style={styles.researchSection}>
                <Text style={styles.sectionTitle}>연구 분야</Text>
                <View style={styles.researchChips}>
                  {professor.researchAreas.map((area) => (
                    <View key={area} style={styles.researchChip}>
                      <Text style={styles.researchChipText}>{area}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.aiToggle}
              onPress={() => setShowAiSummary(!showAiSummary)}
            >
              <Text style={styles.aiToggleText}>
                {showAiSummary ? '▲ 분석 결과 접기' : '✨ AI 분석 결과 보기'}
              </Text>
            </TouchableOpacity>

            {showAiSummary && (
              <View style={styles.aiSection}>
                <AiSummaryCard
                  summary={aiSummary?.summary ?? null}
                  loading={aiLoading}
                  updatedAt={aiSummary?.updatedAt}
                />
              </View>
            )}

            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>💬 후기 ({professor.reviewCount})</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ReviewCard
            review={item}
            currentUserId={user?.id}
            onLike={(reviewId, liked) => likeMutation.mutate({ reviewId, liked })}
            onDelete={(reviewId) => deleteMutation.mutate(reviewId)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>아직 등록된 후기가 없어요</Text>
            <Text style={styles.emptyDesc}>첫 번째 후기를 남기고 다른 학생들을 도와주세요.</Text>
          </View>
        }
      />

      <View style={styles.fab}>
        <Button
          label="후기 남기기"
          onPress={() => router.push(`/professor/${id}/review`)}
          size="md"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  backBtn: { padding: Spacing.md },
  heroSection: { alignItems: 'center', paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg },
  name: { fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: Spacing.sm },
  position: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  affiliation: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, textAlign: 'center' },
  ratingOverall: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: Spacing.sm },
  ratingNum: { fontSize: 20, fontWeight: '800' },
  reviewCountText: { fontSize: 13, color: Colors.textTertiary },
  tagsRow: { paddingHorizontal: Spacing.md, gap: 8, paddingBottom: Spacing.md },
  ratingsSection: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  bioSection: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.md },
  bio: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  researchSection: { marginHorizontal: Spacing.md, marginBottom: Spacing.md, backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.md },
  researchChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  researchChip: { backgroundColor: Colors.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  researchChipText: { fontSize: 12, color: Colors.primary, fontWeight: '500' },
  aiToggle: { marginHorizontal: Spacing.md, marginBottom: Spacing.sm, alignSelf: 'flex-start' },
  aiToggleText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  aiSection: { marginHorizontal: Spacing.md, marginBottom: Spacing.md },
  reviewsHeader: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: 100 },
  emptyWrap: { alignItems: 'center', marginTop: Spacing.xl, paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 6, textAlign: 'center' },
  emptyDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  fab: { position: 'absolute', bottom: 24, right: 20, left: 20 },
});
