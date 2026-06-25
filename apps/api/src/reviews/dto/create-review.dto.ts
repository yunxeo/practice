import {
  IsUUID,
  IsString,
  MinLength,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  professorId!: string;

  @IsString()
  @MinLength(20, { message: '후기는 최소 20자 이상 작성해주세요.' })
  @MaxLength(2000, { message: '후기는 최대 2000자까지 작성 가능합니다.' })
  content!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  ratingOverall!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  ratingDifficulty!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  ratingClarity!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  ratingHelpfulness!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  courseName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  semester?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean = false;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
