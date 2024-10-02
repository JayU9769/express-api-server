import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, Min, IsArray, ArrayNotEmpty } from 'class-validator';
import { UserType } from '@prisma/client';

/**
 * DTO for creating a new role.
 */
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;

  @IsEnum(UserType, { message: 'Invalid user type' })
  @IsOptional() // Defaults to 'user' if not provided
  type?: UserType;

  @IsInt()
  @Min(0, { message: 'Status must be 0 or 1' })
  @IsOptional() // Defaults to 1 if not provided
  status?: number;
}

/**
 * DTO for updating an existing role.
 */
export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserType, { message: 'Invalid user type' })
  @IsOptional()
  type?: UserType;

  @IsInt()
  @Min(0, { message: 'Status must be 0 or 1' })
  @IsOptional()
  status?: number;
}
