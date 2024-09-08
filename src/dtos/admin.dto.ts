import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginAdminDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  public password: string;
}

// DTO for updating profile
export class UpdateProfileDto {
  @IsEmail()
  public email: string;

  @IsString()
  public name: string;
}

// DTO for updating password
export class UpdatePasswordDto {
  @IsString()
  public currentPassword: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  public newPassword: string;
}
