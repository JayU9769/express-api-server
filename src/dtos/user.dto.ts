import { IsEmail, IsInt, IsOptional, IsString, MinLength, IsNotEmpty, IsPhoneNumber, Min, Validate } from 'class-validator';
import { Match } from './match.decorator';

/**
 * DTO for creating a new user.
 * Ensures validation rules are applied for fields like email, name, phoneNo, and password.
 */
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsPhoneNumber('IN')
  @IsNotEmpty()
  public phoneNo: string;

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
 * DTO for updating an existing user.
 * Allows partial updates by making all fields optional.
 */
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public name?: string;

  @IsPhoneNumber(null)
  @IsOptional()
  public phoneNo?: string;

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
export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  public newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirmation password is required' })
  @Validate(Match, ['newPassword'], { message: 'Passwords do not match' })
  public confirmNewPassword: string;
}
