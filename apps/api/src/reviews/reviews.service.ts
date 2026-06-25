import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UserRole } from '@profiler-ai/shared';

@Injectable()
export class ReviewsService {
  constructor(private supabase: SupabaseService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const { data: existing } = await this.supabase.db
      .from('reviews')
      .select('id')
      .eq('professor_id', dto.professorId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) throw new ConflictException('이미 해당 교수에 대한 후기를 작성하셨습니다.');

    const { data: review, error } = await this.supabase.db
      .from('reviews')
      .insert({
        professor_id: dto.professorId,
        user_id: userId,
        content: dto.content,
        rating_overall: dto.ratingOverall,
        rating_difficulty: dto.ratingDifficulty,
        rating_clarity: dto.ratingClarity,
        rating_helpfulness: dto.ratingHelpfulness,
        course_name: dto.courseName ?? null,
        semester: dto.semester ?? null,
        is_anonymous: dto.isAnonymous ?? false,
      })
      .select()
      .single();

    if (error || !review) throw new ConflictException('후기 작성에 실패했습니다.');

    if (dto.tags && dto.tags.length > 0) {
      await this.upsertTags(dto.professorId, dto.tags);
    }

    return review;
  }

  async update(reviewId: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.findReviewOrThrow(reviewId);
    if (review['user_id'] !== userId) throw new ForbiddenException('본인의 후기만 수정할 수 있습니다.');

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (dto.content !== undefined) updates['content'] = dto.content;
    if (dto.ratingOverall !== undefined) updates['rating_overall'] = dto.ratingOverall;
    if (dto.ratingDifficulty !== undefined) updates['rating_difficulty'] = dto.ratingDifficulty;
    if (dto.ratingClarity !== undefined) updates['rating_clarity'] = dto.ratingClarity;
    if (dto.ratingHelpfulness !== undefined) updates['rating_helpfulness'] = dto.ratingHelpfulness;
    if (dto.courseName !== undefined) updates['course_name'] = dto.courseName;
    if (dto.semester !== undefined) updates['semester'] = dto.semester;
    if (dto.isAnonymous !== undefined) updates['is_anonymous'] = dto.isAnonymous;

    const { data: updated, error } = await this.supabase.db
      .from('reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single();

    if (error || !updated) throw new NotFoundException('후기 수정에 실패했습니다.');
    return updated;
  }

  async remove(reviewId: string, userId: string, userRole: UserRole) {
    const review = await this.findReviewOrThrow(reviewId);
    if (review['user_id'] !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('본인의 후기만 삭제할 수 있습니다.');
    }

    await this.supabase.db
      .from('reviews')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', reviewId);
  }

  async like(reviewId: string, userId: string) {
    await this.findReviewOrThrow(reviewId);

    const { data: existing } = await this.supabase.db
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existing) throw new ConflictException('이미 좋아요를 눌렀습니다.');

    await this.supabase.db
      .from('review_likes')
      .insert({ review_id: reviewId, user_id: userId });

    await this.supabase.db.rpc('increment_review_likes', { review_id: reviewId });

    const { data } = await this.supabase.db
      .from('reviews')
      .select('likes_count')
      .eq('id', reviewId)
      .single();

    return { likesCount: data?.likes_count ?? 0 };
  }

  async unlike(reviewId: string, userId: string) {
    await this.findReviewOrThrow(reviewId);

    await this.supabase.db
      .from('review_likes')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', userId);

    await this.supabase.db.rpc('decrement_review_likes', { review_id: reviewId });

    const { data } = await this.supabase.db
      .from('reviews')
      .select('likes_count')
      .eq('id', reviewId)
      .single();

    return { likesCount: data?.likes_count ?? 0 };
  }

  private async findReviewOrThrow(reviewId: string) {
    const { data } = await this.supabase.db
      .from('reviews')
      .select('id, user_id, professor_id')
      .eq('id', reviewId)
      .eq('is_deleted', false)
      .maybeSingle();

    if (!data) throw new NotFoundException('후기를 찾을 수 없습니다.');
    return data;
  }

  private async upsertTags(professorId: string, tags: string[]) {
    for (const label of tags) {
      const { data: existing } = await this.supabase.db
        .from('professor_tags')
        .select('id, count')
        .eq('professor_id', professorId)
        .eq('label', label)
        .maybeSingle();

      if (existing) {
        await this.supabase.db
          .from('professor_tags')
          .update({ count: (existing.count as number) + 1 })
          .eq('id', existing.id);
      } else {
        await this.supabase.db
          .from('professor_tags')
          .insert({ professor_id: professorId, label, count: 1 });
      }
    }
  }
}
