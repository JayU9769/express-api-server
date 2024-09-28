import {IsNumber, ValidateNested, IsObject, IsString} from 'class-validator';
import { Type } from 'class-transformer';


// Define Role DTO for validation
class RoleDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

// Define Permission DTO for validation
class PermissionDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class UpdatePermissionRequestDto {
  @IsNumber()
  value: number;

  @IsObject()
  @ValidateNested()
  @Type(() => RoleDTO) // Use RoleDTO for validation
  role: RoleDTO;

  @IsObject()
  @ValidateNested()
  @Type(() => PermissionDTO) // Use PermissionDTO for validation
  permission: PermissionDTO;
}
