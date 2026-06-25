import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  email!: string;

  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(100)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)/, {
    message: '비밀번호는 영문자와 숫자를 포함해야 합니다.',
  })
  password!: string;

  @IsString()
  @MinLength(2, { message: '닉네임은 최소 2자 이상이어야 합니다.' })
  @MaxLength(20, { message: '닉네임은 최대 20자까지 가능합니다.' })
  nickname!: string;

  @IsOptional()
  @IsUUID()
  universityId?: string;
}
