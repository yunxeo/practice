import { IsUUID, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export enum ReportReason {
  SPAM = 'spam',
  INAPPROPRIATE = 'inappropriate',
  FALSE_INFO = 'false_info',
  OTHER = 'other',
}

export class CreateReportDto {
  @IsUUID()
  reviewId!: string;

  @IsEnum(ReportReason, { message: '신고 사유가 올바르지 않습니다.' })
  reason!: ReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  detail?: string;
}
