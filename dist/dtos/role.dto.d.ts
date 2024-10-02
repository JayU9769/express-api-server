import { UserType } from '@prisma/client';
/**
 * DTO for creating a new role.
 */
export declare class CreateRoleDto {
    name: string;
    type?: UserType;
    status?: number;
}
/**
 * DTO for updating an existing role.
 */
export declare class UpdateRoleDto {
    name?: string;
    type?: UserType;
    status?: number;
}
