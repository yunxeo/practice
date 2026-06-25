import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingOverall?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingDifficulty?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingClarity?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingHelpfulness?: number;

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
  isAnonymous?: boolean;
}
