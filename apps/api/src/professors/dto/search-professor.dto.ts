import { IsOptional, IsString, IsUUID, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProfessorDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  courseName?: string;

  @IsOptional()
  @IsUUID()
  universityId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsIn(['rating', 'reviews', 'name'])
  sortBy?: 'rating' | 'reviews' | 'name' = 'rating';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;
}
