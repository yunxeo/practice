import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { CreateReportDto } from './dto/create-report.dto';
import { UserRole } from '@profiler-ai/shared';

@Injectable()
export class ReportsService {
  constructor(private supabase: SupabaseService) {}

  async create(reporterId: string, dto: CreateReportDto) {
    const { data: review } = await this.supabase.db
      .from('reviews')
      .select('id')
      .eq('id', dto.reviewId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!review) throw new NotFoundException('존재하지 않는 후기입니다.');

    const { data: existing } = await this.supabase.db
      .from('reports')
      .select('id')
      .eq('review_id', dto.reviewId)
      .eq('reporter_id', reporterId)
      .maybeSingle();

    if (existing) throw new ConflictException('이미 신고한 후기입니다.');

    const { data, error } = await this.supabase.db
      .from('reports')
      .insert({
        review_id: dto.reviewId,
        reporter_id: reporterId,
        reason: dto.reason,
        detail: dto.detail ?? null,
        status: 'pending',
      })
      .select()
      .single();

    if (error || !data) throw new ConflictException('신고 접수에 실패했습니다.');
    return { message: '신고가 접수되었습니다.', reportId: data.id };
  }

  async findAll(userRole: UserRole) {
    if (userRole !== UserRole.ADMIN) throw new ForbiddenException('관리자만 접근 가능합니다.');

    const { data } = await this.supabase.db
      .from('reports')
      .select(`
        id, reason, detail, status, created_at,
        reviews (id, content, professor_id),
        users!reporter_id (id, nickname, email)
      `)
      .order('created_at', { ascending: false });

    return data ?? [];
  }

  async updateStatus(reportId: string, status: 'reviewed' | 'dismissed', userRole: UserRole) {
    if (userRole !== UserRole.ADMIN) throw new ForbiddenException('관리자만 접근 가능합니다.');

    await this.supabase.db
      .from('reports')
      .update({ status })
      .eq('id', reportId);

    return { message: '신고 상태가 업데이트되었습니다.' };
  }
}
