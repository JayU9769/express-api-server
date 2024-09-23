import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsInt, IsOptional, Min, Validate } from 'class-validator';
import { Match } from './match.decorator';

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

/**
 * DTO for creating a new admin.
 * Ensures validation rules are applied for fields like email, name, phoneNo, and password.
 */
export class CreateAdminDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  public password: string;

  @IsInt()
  @IsOptional()
  @Min(0, { message: 'Status must be 0 or 1' })
  public status?: number;
}

/**
 * DTO for updating an existing admin.
 * Allows partial updates by making all fields optional.
 */
export class UpdateAdminDto {
  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  public password?: string;

  @IsInt()
  @IsOptional()
  public status?: number;
}

/**
 * DTO for updating the password.
 */
export class UpdateAdminPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  public newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirmation password is required' })
  @Validate(Match, ['newPassword'], { message: 'Passwords do not match' })
  public confirmNewPassword: string;
}
