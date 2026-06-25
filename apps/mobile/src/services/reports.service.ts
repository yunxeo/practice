import { api } from './api';

export type ReportReason = 'spam' | 'inappropriate' | 'false_info' | 'other';

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: '스팸/광고',
  inappropriate: '욕설/부적절한 내용',
  false_info: '허위 정보',
  other: '기타',
};

export const reportsService = {
  async create(params: { reviewId: string; reason: ReportReason; detail?: string }) {
    const res = await api.post<{ data: { message: string; reportId: string } }>('/reports', params);
    return res.data.data;
  },
};
