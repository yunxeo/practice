import { IsOptional, IsString, MinLength, MaxLength, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  @IsOptional()
  @IsUUID()
  universityId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  studentId?: string;
}
