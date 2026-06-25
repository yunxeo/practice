import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../config/supabase.config';
import { SearchUniversityDto } from './dto/search-university.dto';
import { PaginatedResponse, University, UniversitySummary } from '@profiler-ai/shared';

@Injectable()
export class UniversitiesService {
  constructor(private supabase: SupabaseService) {}

  async search(dto: SearchUniversityDto): Promise<PaginatedResponse<UniversitySummary>> {
    const limit = dto.limit ?? 20;
    const offset = dto.offset ?? 0;

    let query = this.supabase.db
      .from('universities')
      .select('id, name, short_name, logo_url, location, professor_count', { count: 'exact' })
      .order('professor_count', { ascending: false })
      .range(offset, offset + limit - 1);

    if (dto.q) {
      query = query.ilike('name', `%${dto.q}%`);
    }

    const { data, count, error } = await query;
    if (error) throw new Error(error.message);

    return {
      data: (data ?? []).map((u) => ({
        id: u.id as string,
        name: u.name as string,
        shortName: u.short_name as string | null,
        logoUrl: u.logo_url as string | null,
        location: u.location as string | null,
        professorCount: u.professor_count as number,
      })) as unknown as UniversitySummary[],
      total: count ?? 0,
      limit,
      offset,
    };
  }

  async findById(id: string): Promise<University> {
    const { data: uni } = await this.supabase.db
      .from('universities')
      .select('id, name, short_name, domain, logo_url, location, established_year, professor_count')
      .eq('id', id)
      .maybeSingle();

    if (!uni) throw new NotFoundException('대학교를 찾을 수 없습니다.');

    const departments = await this.getDepartments(id);

    return {
      id: uni.id as string,
      name: uni.name as string,
      shortName: uni.short_name as string | null,
      domain: uni.domain as string | null,
      logoUrl: uni.logo_url as string | null,
      location: uni.location as string | null,
      establishedYear: uni.established_year as number | null,
      professorCount: uni.professor_count as number,
      departments,
    };
  }

  async getDepartments(universityId: string) {
    const { data } = await this.supabase.db
      .from('departments')
      .select('id, name, college')
      .eq('university_id', universityId)
      .order('college')
      .order('name');

    return (data ?? []).map((d) => ({
      id: d.id as string,
      name: d.name as string,
      college: d.college as string | null,
    }));
  }
}
