import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StarRating } from '../../../components/ui/StarRating';
import { TagChip } from '../../../components/ui/TagChip';
import { useProfessor } from '../../../hooks/useProfessors';
import { useCreateReview } from '../../../hooks/useReviews';
import { PREDEFINED_TAGS } from '../../../types';
import { sanitizeContent } from '../../../utils/contentFilter';
import { Colors, Spacing } from '../../../utils/colors';

const SEMESTERS = ['2025-1', '2024-2', '2024-1', '2023-2', '2023-1'];

export default function WriteReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: professor } = useProfessor(id);
  const createMutation = useCreateReview();

  const [form, setForm] = useState({
    content: '',
    ratingOverall: 0,
    ratingDifficulty: 0,
    ratingClarity: 0,
    ratingHelpfulness: 0,
    courseName: '',
    semester: '',
    isAnonymous: false,
    tags: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleTag = (tag: string) => {
    set(
      'tags',
      form.tags.includes(tag)
        ? form.tags.filter((t) => t !== tag)
        : [...form.tags, tag],
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.ratingOverall === 0) e['ratingOverall'] = '전반 평점을 선택해 주세요.';
    if (form.content.length < 20) e['content'] = '20자 이상 작성해 주세요.';

    const { isClean, message } = sanitizeContent(form.content);
    if (!isClean) e['content'] = message ?? '정중한 언어로 작성해 주세요.';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createMutation.mutateAsync({
        professorId: id,
        content: form.content,
        ratingOverall: form.ratingOverall,
        ratingDifficulty: form.ratingDifficulty || 3,
        ratingClarity: form.ratingClarity || 3,
        ratingHelpfulness: form.ratingHelpfulness || 3,
        courseName: form.courseName || undefined,
        semester: form.semester || undefined,
        isAnonymous: form.isAnonymous,
        tags: form.tags,
      });
      Alert.alert('후기가 등록됐어요', '당신의 경험이 다음 수강생에게 큰 도움이 될 거예요.', [
        { text: '닫기', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('후기를 등록하지 못했어요', '잠시 후 다시 시도해 주세요.');
    }
  };

  const RatingRow = ({ label, field }: { label: string; field: 'ratingOverall' | 'ratingDifficulty' | 'ratingClarity' | 'ratingHelpfulness' }) => (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <StarRating
        value={form[field]}
        onChange={(v) => set(field, v)}
        size={28}
      />
      <Text style={styles.ratingValue}>{form[field] > 0 ? form[field] : '-'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>이번 수업은 어땠나요?</Text>
          <View style={{ width: 24 }} />
        </View>

        {professor && (
          <View style={styles.professorBanner}>
            <Text style={styles.professorBannerName}>{professor.name}</Text>
            <Text style={styles.professorBannerSub}>
              {professor.university.name}{professor.department ? ` · ${professor.department.name}` : ''}
            </Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>평점 *</Text>
            <RatingRow label="전반 평점" field="ratingOverall" />
            {errors['ratingOverall'] && <Text style={styles.error}>{errors['ratingOverall']}</Text>}
            <RatingRow label="강의 난이도" field="ratingDifficulty" />
            <RatingRow label="전달력" field="ratingClarity" />
            <RatingRow label="친절도" field="ratingHelpfulness" />
          </View>

          <View style={styles.section}>
            <Input
              label="수강 과목"
              value={form.courseName}
              onChangeText={(v) => set('courseName', v)}
              placeholder="예: 운영체제, 자료구조 (선택)"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>학기</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.semesterRow}>
              {SEMESTERS.map((s) => (
                <TagChip
                  key={s}
                  label={s}
                  selected={form.semester === s}
                  onPress={() => set('semester', form.semester === s ? '' : s)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>태그 (선택)</Text>
            <View style={styles.tagsGrid}>
              {PREDEFINED_TAGS.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  selected={form.tags.includes(tag)}
                  onPress={() => toggleTag(tag)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Input
              label="후기 내용 *"
              value={form.content}
              onChangeText={(v) => set('content', v)}
              placeholder="이번 수업은 어땠나요? 다음 수강생에게 도움이 되는 경험을 남겨 주세요. (최소 20자)"
              multiline
              numberOfLines={6}
              style={styles.textArea}
              error={errors['content']}
            />
            <Text style={styles.charCount}>{form.content.length}자</Text>
          </View>

          <View style={styles.anonymousRow}>
            <View>
              <Text style={styles.anonymousLabel}>익명으로 작성</Text>
              <Text style={styles.anonymousSub}>이름이 표시되지 않습니다</Text>
            </View>
            <Switch
              value={form.isAnonymous}
              onValueChange={(v) => set('isAnonymous', v)}
              trackColor={{ true: Colors.primary }}
            />
          </View>

          <Button
            label="후기 등록하기"
            onPress={handleSubmit}
            loading={createMutation.isPending}
            size="lg"
            style={styles.submitBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  professorBanner: { backgroundColor: Colors.primary + '10', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  professorBannerName: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  professorBannerSub: { fontSize: 12, color: Colors.textSecondary },
  container: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  section: { marginBottom: Spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: Spacing.sm },
  ratingLabel: { fontSize: 13, color: Colors.textSecondary, width: 60 },
  ratingValue: { fontSize: 14, fontWeight: '700', color: Colors.text, width: 24, textAlign: 'right' },
  semesterRow: { gap: 8 },
  tagsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  textArea: { height: 120, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: Colors.textTertiary, textAlign: 'right', marginTop: 4 },
  anonymousRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.md, marginBottom: Spacing.md },
  anonymousLabel: { fontSize: 14, fontWeight: '500', color: Colors.text },
  anonymousSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  submitBtn: { marginTop: Spacing.sm },
  error: { fontSize: 12, color: Colors.error, marginTop: 2 },
});
