import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { SupabaseService } from '../config/supabase.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, UserProfile, UserRole } from '@profiler-ai/shared';

@Injectable()
export class AuthService {
  constructor(
    private supabase: SupabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data: existing } = await this.supabase.db
      .from('users')
      .select('id')
      .eq('email', dto.email)
      .maybeSingle();

    if (existing) throw new ConflictException('이미 등록된 이메일입니다.');

    const passwordHash = await argon2.hash(dto.password);

    const { data: user, error } = await this.supabase.db
      .from('users')
      .insert({
        email: dto.email,
        password_hash: passwordHash,
        nickname: dto.nickname,
        university_id: dto.universityId ?? null,
        role: UserRole.STUDENT,
      })
      .select('id, email, nickname, role, avatar_url, bio, university_id, is_verified, created_at')
      .single();

    if (error || !user) throw new ConflictException('회원가입에 실패했습니다.');

    const profile = await this.buildUserProfile(user);
    const tokens = this.issueTokens(user.id, user.email, user.role);

    return { ...tokens, user: profile };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data: user } = await this.supabase.db
      .from('users')
      .select('id, email, nickname, role, avatar_url, bio, university_id, is_verified, created_at, password_hash')
      .eq('email', dto.email)
      .maybeSingle();

    if (!user) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    const isValid = await argon2.verify(user.password_hash, dto.password);
    if (!isValid) throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');

    const profile = await this.buildUserProfile(user);
    const tokens = this.issueTokens(user.id, user.email, user.role);

    return { ...tokens, user: profile };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwt.verify<{ sub: string; email: string; role: string }>(refreshToken, {
        secret: this.config.get<string>('jwt.refreshSecret'),
      });

      const accessToken = this.jwt.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        {
          secret: this.config.get<string>('jwt.secret'),
          expiresIn: this.config.get<string>('jwt.expiresIn'),
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }
  }

  async getMe(userId: string): Promise<UserProfile> {
    const { data: user } = await this.supabase.db
      .from('users')
      .select('id, email, nickname, role, avatar_url, bio, university_id, is_verified, created_at')
      .eq('id', userId)
      .maybeSingle();

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    return this.buildUserProfile(user);
  }

  private issueTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.secret'),
      expiresIn: this.config.get<string>('jwt.expiresIn'),
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }

  private async buildUserProfile(user: Record<string, unknown>): Promise<UserProfile> {
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
