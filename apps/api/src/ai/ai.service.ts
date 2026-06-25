import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { AiProviderInterface, AI_PROVIDER } from './interfaces/ai-provider.interface';
import { AiSummaryResponse } from '@profiler-ai/shared';

const SUMMARY_CACHE_HOURS = 24;

@Injectable()
export class AiService {
  constructor(
    private supabase: SupabaseService,
    @Inject(AI_PROVIDER) private aiProvider: AiProviderInterface,
  ) {}

  async getProfessorSummary(professorId: string): Promise<AiSummaryResponse> {
    const { data: professor } = await this.supabase.db
      .from('professors')
      .select(`
        id, name, avg_rating, review_count,
        departments (name),
        universities (name)
      `)
      .eq('id', professorId)
      .maybeSingle();

    if (!professor) throw new NotFoundException('교수를 찾을 수 없습니다.');

    // PRD: ai_profiles 별도 테이블에서 캐시 조회
    const { data: existingProfile } = await this.supabase.db
      .from('ai_profiles')
      .select('id, summary, persona, review_count_at_gen, updated_at')
      .eq('professor_id', professorId)
      .maybeSingle();

    const reviewCount = professor['review_count'] as number;

    const cacheValid =
      existingProfile &&
      !this.isCacheExpired(existingProfile.updated_at as string) &&
      (existingProfile.review_count_at_gen as number) >= reviewCount - 5;

    if (cacheValid && existingProfile) {
      return {
        professorId,
        summary: existingProfile.summary as string,
        updatedAt: existingProfile.updated_at as string,
        reviewCount,
      };
    }

    const { data: reviews } = await this.supabase.db
      .from('reviews')
      .select('content, rating_overall, course_name, semester')
      .eq('professor_id', professorId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(15);

    const dept = professor['departments'] as Record<string, unknown> | null;
    const uni = professor['universities'] as Record<string, unknown>;

    const summary = await this.aiProvider.generateProfessorSummary({
      professorName: professor['name'] as string,
      department: dept ? (dept['name'] as string) : '미분류',
      university: uni['name'] as string,
      reviews: (reviews ?? []).map((r) => ({
        content: r['content'] as string,
        ratingOverall: r['rating_overall'] as number,
        courseName: r['course_name'] as string | undefined,
        semester: r['semester'] as string | undefined,
      })),
      avgRating: Number(professor['avg_rating']) || 0,
      reviewCount,
    });

    const now = new Date().toISOString();

    // PRD: ai_profiles 테이블에 upsert
    if (existingProfile) {
      await this.supabase.db
        .from('ai_profiles')
        .update({
          summary,
          review_count_at_gen: reviewCount,
          updated_at: now,
        })
        .eq('professor_id', professorId);
    } else {
      await this.supabase.db.from('ai_profiles').insert({
        professor_id: professorId,
        summary,
        review_count_at_gen: reviewCount,
        generated_at: now,
        updated_at: now,
      });
    }

    return { professorId, summary, updatedAt: now, reviewCount };
  }

  private isCacheExpired(updatedAt: string): boolean {
    const updated = new Date(updatedAt);
    const now = new Date();
    return (now.getTime() - updated.getTime()) / (1000 * 60 * 60) > SUMMARY_CACHE_HOURS;
  }
}
