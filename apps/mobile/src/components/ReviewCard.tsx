import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './ui/Card';
import { StarRating } from './ui/StarRating';
import { Avatar } from './ui/Avatar';
import { Review } from '../types';
import { Colors, Spacing, Radius } from '../utils/colors';
import { formatDate, formatSemester } from '../utils/formatters';
import { reportsService, ReportReason, REPORT_REASON_LABELS } from '../services/reports.service';

interface Props {
  review: Review;
  currentUserId?: string;
  onLike: (reviewId: string, liked: boolean) => void;
  onDelete?: (reviewId: string) => void;
}

export function ReviewCard({ review, currentUserId, onLike, onDelete }: Props) {
  const isOwner = review.author?.id === currentUserId;
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [reportDetail, setReportDetail] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const handleDelete = () => {
    Alert.alert('후기를 삭제할까요?', '삭제된 후기는 복구할 수 없어요.', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => onDelete?.(review.id) },
    ]);
  };

  const handleReport = async () => {
    if (!selectedReason) {
      Alert.alert('신고 사유를 선택해 주세요.');
      return;
    }
    setIsReporting(true);
    try {
      await reportsService.create({
        reviewId: review.id,
        reason: selectedReason,
        detail: reportDetail || undefined,
      });
      setReportModalVisible(false);
      setSelectedReason(null);
      setReportDetail('');
      Alert.alert('신고가 접수됐어요', '검토 후 조치할게요.');
    } catch {
      Alert.alert('신고를 접수하지 못했어요', '잠시 후 다시 시도해 주세요.');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Avatar
            uri={review.author?.avatarUrl}
            fallbackText={review.isAnonymous ? '익명' : review.author?.nickname}
            size={36}
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>
              {review.isAnonymous ? '익명' : review.author?.nickname ?? '알 수 없음'}
            </Text>
            {(review.courseName || review.semester) && (
              <Text style={styles.meta}>
                {[review.courseName, review.semester ? formatSemester(review.semester) : null]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <StarRating value={review.ratings.overall} size={12} />
            <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.content}>{review.content}</Text>

        <View style={styles.ratingsRow}>
          {[
            { label: '난이도', value: review.ratings.difficulty },
            { label: '전달력', value: review.ratings.clarity },
            { label: '친절도', value: review.ratings.helpfulness },
          ].map(({ label, value }) => (
            <View key={label} style={styles.ratingChip}>
              <Text style={styles.ratingChipLabel}>{label}</Text>
              <Text style={styles.ratingChipValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.likeBtn}
            onPress={() => onLike(review.id, review.isLikedByMe)}
          >
            <Ionicons
              name={review.isLikedByMe ? 'heart' : 'heart-outline'}
              size={16}
              color={review.isLikedByMe ? Colors.error : Colors.textSecondary}
            />
            <Text style={[styles.likeCount, review.isLikedByMe && styles.liked]}>
              {review.likesCount}
            </Text>
          </TouchableOpacity>

          <View style={styles.footerActions}>
            {!isOwner && (
              <TouchableOpacity
                onPress={() => setReportModalVisible(true)}
                style={styles.actionBtn}
              >
                <Ionicons name="flag-outline" size={14} color={Colors.textTertiary} />
                <Text style={styles.actionBtnText}>신고</Text>
              </TouchableOpacity>
            )}
            {isOwner && (
              <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={14} color={Colors.textTertiary} />
                <Text style={styles.actionBtnText}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>

      {/* 신고 모달 */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>후기 신고</Text>
              <TouchableOpacity onPress={() => setReportModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>어떤 문제가 있나요?</Text>

            <View style={styles.reasonList}>
              {(Object.keys(REPORT_REASON_LABELS) as ReportReason[]).map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason && styles.reasonItemSelected,
                  ]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <View style={[styles.radioCircle, selectedReason === reason && styles.radioSelected]} />
                  <Text style={[styles.reasonLabel, selectedReason === reason && styles.reasonLabelSelected]}>
                    {REPORT_REASON_LABELS[reason]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.detailInput}
              placeholder="구체적인 내용을 입력해 주세요 (선택)"
              placeholderTextColor={Colors.textTertiary}
              value={reportDetail}
              onChangeText={setReportDetail}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[styles.reportBtn, (!selectedReason || isReporting) && styles.reportBtnDisabled]}
              onPress={handleReport}
              disabled={!selectedReason || isReporting}
            >
              <Text style={styles.reportBtnText}>
                {isReporting ? '접수 중...' : '신고 접수하기'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  meta: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  headerRight: { alignItems: 'flex-end', gap: 2 },
  date: { fontSize: 11, color: Colors.textTertiary },
  content: { fontSize: 14, color: Colors.text, lineHeight: 20, marginBottom: Spacing.sm },
  ratingsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  ratingChip: { flexDirection: 'row', gap: 4, backgroundColor: Colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  ratingChipLabel: { fontSize: 11, color: Colors.textSecondary },
  ratingChipValue: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  likeCount: { fontSize: 13, color: Colors.textSecondary },
  liked: { color: Colors.error },
  footerActions: { flexDirection: 'row', gap: Spacing.sm },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  actionBtnText: { fontSize: 12, color: Colors.textTertiary },

  // 신고 모달
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.xl, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text },
  modalSubtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: Spacing.md },
  reasonList: { gap: 4, marginBottom: Spacing.md },
  reasonItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: 12, paddingHorizontal: Spacing.md, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border },
  reasonItemSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.border },
  radioSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  reasonLabel: { fontSize: 14, color: Colors.text },
  reasonLabelSelected: { color: Colors.primary, fontWeight: '600' },
  detailInput: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.md, padding: Spacing.md, fontSize: 14, color: Colors.text, height: 80, textAlignVertical: 'top', marginBottom: Spacing.md },
  reportBtn: { backgroundColor: Colors.error, borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center' },
  reportBtnDisabled: { opacity: 0.4 },
  reportBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
