import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfile, UserRole } from '@profiler-ai/shared';

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async findById(userId: string): Promise<UserProfile> {
    const { data: user } = await this.supabase.db
      .from('users')
      .select('id, email, nickname, role, avatar_url, bio, university_id, is_verified, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return this.mapToProfile(user);
  }

  async update(userId: string, dto: UpdateUserDto): Promise<UserProfile> {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (dto.nickname !== undefined) updates['nickname'] = dto.nickname;
    if (dto.bio !== undefined) updates['bio'] = dto.bio;
    if (dto.universityId !== undefined) updates['university_id'] = dto.universityId;
    if (dto.studentId !== undefined) updates['student_id'] = dto.studentId;

    const { data: user, error } = await this.supabase.db
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, nickname, role, avatar_url, bio, university_id, is_verified, created_at')
      .single();

    if (error || !user) throw new NotFoundException('프로필 업데이트에 실패했습니다.');
    return this.mapToProfile(user);
  }

  async getMyReviews(userId: string) {
    const { data: reviews } = await this.supabase.db
      .from('reviews')
      .select(`
        id, content, rating_overall, rating_difficulty, rating_clarity, rating_helpfulness,
        course_name, semester, is_anonymous, likes_count, created_at, updated_at,
        professors (id, name, photo_url, universities (id, name))
      `)
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    return reviews ?? [];
  }

  private async mapToProfile(user: Record<string, unknown>): Promise<UserProfile> {
    let university = null;
    if (user['university_id']) {
      const { data: uni } = await this.supabase.db
        .from('universities')
        .select('id, name, short_name, logo_url')
        .eq('id', user['university_id'])
        .maybeSingle();
      if (uni) {
        university = {
          id: uni.id as string,
          name: uni.name as string,
          shortName: uni.short_name as string | null,
          logoUrl: uni.logo_url as string | null,
        };
      }
    }

    return {
      id: user['id'] as string,
      email: user['email'] as string,
      nickname: user['nickname'] as string,
      role: user['role'] as UserRole,
      avatarUrl: user['avatar_url'] as string | null,
      bio: user['bio'] as string | null,
      university,
      isVerified: Boolean(user['is_verified']),
      createdAt: user['created_at'] as string,
    };
  }
}
