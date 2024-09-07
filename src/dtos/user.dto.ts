import {IsEmail, IsInt, IsOptional, IsString, MinLength, IsNotEmpty, IsPhoneNumber, Min} from 'class-validator';

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

  @IsPhoneNumber("IN")
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