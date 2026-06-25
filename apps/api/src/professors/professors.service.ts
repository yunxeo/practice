import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { SearchProfessorDto } from './dto/search-professor.dto';
import { Professor, ProfessorSummary, PaginatedResponse } from '@profiler-ai/shared';

@Injectable()
export class ProfessorsService {
  constructor(private supabase: SupabaseService) {}

  async search(dto: SearchProfessorDto): Promise<PaginatedResponse<ProfessorSummary>> {
    const limit = dto.limit ?? 20;
    const offset = dto.offset ?? 0;
    const sortColumn = dto.sortBy === 'reviews' ? 'review_count'
      : dto.sortBy === 'name' ? 'name'
      : 'avg_rating';

    let query = this.supabase.db
      .from('professors')
      .select(`
        id, name, position, photo_url, avg_rating, avg_difficulty, review_count,
        departments (id, name, college),
        universities (id, name, short_name, logo_url)
      `, { count: 'exact' })
      .order(sortColumn, { ascending: dto.order === 'asc' })
      .range(offset, offset + limit - 1);

    if (dto.q) query = query.ilike('name', `%${dto.q}%`);
    if (dto.universityId) query = query.eq('university_id', dto.universityId);
    if (dto.departmentId) query = query.eq('department_id', dto.departmentId);

    // FR-003: 과목명으로 교수 검색 — reviews.course_name에서 해당 교수 ID 조회
    if (dto.courseName) {
      const { data: matchedReviews } = await this.supabase.db
        .from('reviews')
        .select('professor_id')
        .ilike('course_name', `%${dto.courseName}%`)
        .eq('is_deleted', false);

      const professorIds = [...new Set((matchedReviews ?? []).map((r) => r['professor_id'] as string))];
      if (professorIds.length === 0) return { data: [], total: 0, limit, offset };
      query = query.in('id', professorIds);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    const professors = await Promise.all(
      (data ?? []).map(async (p) => this.mapToSummary(p)),
    );

    return { data: professors, total: count ?? 0, limit, offset };
  }

  async findById(id: string): Promise<Professor> {
    const { data: p } = await this.supabase.db
      .from('professors')
      .select(`
        id, name, position, email, photo_url, bio, research_areas,
        avg_rating, avg_difficulty, avg_clarity, avg_helpfulness, review_count,
        ai_summary, ai_summary_updated_at,
        departments (id, name, college),
        universities (id, name, short_name, logo_url)
      `)
      .eq('id', id)
      .maybeSingle();

    if (!p) throw new NotFoundException('교수를 찾을 수 없습니다.');

    const { data: tags } = await this.supabase.db
      .from('professor_tags')
      .select('label, count')
      .eq('professor_id', id)
      .order('count', { ascending: false })
      .limit(10);

    const dept = p['departments'] as Record<string, unknown> | null;
    const uni = p['universities'] as Record<string, unknown>;

    return {
      id: p['id'] as string,
      name: p['name'] as string,
      position: p['position'] as string | null,
      email: p['email'] as string | null,
      photoUrl: p['photo_url'] as string | null,
      bio: p['bio'] as string | null,
      researchAreas: (p['research_areas'] as string[]) ?? [],
      department: dept
        ? { id: dept['id'] as string, name: dept['name'] as string, college: dept['college'] as string | null }
        : null,
      university: {
        id: uni['id'] as string,
        name: uni['name'] as string,
        shortName: uni['short_name'] as string | null,
        logoUrl: uni['logo_url'] as string | null,
      },
      avgRating: Number(p['avg_rating']) || 0,
      avgDifficulty: Number(p['avg_difficulty']) || 0,
      reviewCount: Number(p['review_count']) || 0,
      topTags: (tags ?? []).slice(0, 3).map((t) => t.label as string),
      ratings: {
        overall: Number(p['avg_rating']) || 0,
        difficulty: Number(p['avg_difficulty']) || 0,
        clarity: Number(p['avg_clarity']) || 0,
        helpfulness: Number(p['avg_helpfulness']) || 0,
      },
      tags: (tags ?? []).map((t) => ({ label: t.label as string, count: t.count as number })),
      aiSummary: p['ai_summary'] as string | null,
      aiSummaryUpdatedAt: p['ai_summary_updated_at'] as string | null,
    };
  }

  async getReviews(professorId: string, limit = 20, offset = 0, currentUserId?: string) {
    const { data: reviews, count } = await this.supabase.db
      .from('reviews')
      .select(`
        id, content, rating_overall, rating_difficulty, rating_clarity, rating_helpfulness,
        course_name, semester, is_anonymous, likes_count, created_at, updated_at,
        users (id, nickname, avatar_url)
      `, { count: 'exact' })
      .eq('professor_id', professorId)
      .eq('is_deleted', false)
      .order('likes_count', { ascending: false })
      .range(offset, offset + limit - 1);

    let likedIds = new Set<string>();
    if (currentUserId && reviews?.length) {
      const reviewIds = reviews.map((r) => r['id'] as string);
      const { data: likes } = await this.supabase.db
        .from('review_likes')
        .select('review_id')
        .eq('user_id', currentUserId)
        .in('review_id', reviewIds);
      likedIds = new Set((likes ?? []).map((l) => l['review_id'] as string));
    }

    return {
      data: (reviews ?? []).map((r) => {
        const author = r['users'] as Record<string, unknown> | null;
        return {
          id: r['id'],
          professorId,
          content: r['content'],
          ratings: {
            overall: r['rating_overall'],
            difficulty: r['rating_difficulty'],
            clarity: r['rating_clarity'],
            helpfulness: r['rating_helpfulness'],
          },
          courseName: r['course_name'],
          semester: r['semester'],
          isAnonymous: r['is_anonymous'],
          author: r['is_anonymous'] || !author
            ? null
            : { id: author['id'], nickname: author['nickname'], avatarUrl: author['avatar_url'] },
          likesCount: r['likes_count'],
          isLikedByMe: likedIds.has(r['id'] as string),
          createdAt: r['created_at'],
          updatedAt: r['updated_at'],
        };
      }),
      total: count ?? 0,
      limit,
      offset,
    };
  }

  private async mapToSummary(p: Record<string, unknown>): Promise<ProfessorSummary> {
    const { data: tags } = await this.supabase.db
      .from('professor_tags')
      .select('label')
      .eq('professor_id', p['id'])
      .order('count', { ascending: false })
      .limit(3);

    const dept = p['departments'] as Record<string, unknown> | null;
    const uni = p['universities'] as Record<string, unknown>;

    return {
      id: p['id'] as string,
      name: p['name'] as string,
      position: p['position'] as string | null,
      photoUrl: p['photo_url'] as string | null,
      department: dept
        ? { id: dept['id'] as string, name: dept['name'] as string, college: dept['college'] as string | null }
        : null,
      university: {
        id: uni['id'] as string,
        name: uni['name'] as string,
        shortName: uni['short_name'] as string | null,
        logoUrl: uni['logo_url'] as string | null,
      },
      avgRating: Number(p['avg_rating']) || 0,
      avgDifficulty: Number(p['avg_difficulty']) || 0,
      reviewCount: Number(p['review_count']) || 0,
      topTags: (tags ?? []).map((t) => t.label as string),
    };
  }
}
