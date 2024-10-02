export declare class LoginAdminDto {
    email: string;
    password: string;
}
export declare class UpdateProfileDto {
    email: string;
    name: string;
}
export declare class UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
/**
 * DTO for creating a new admin.
 * Ensures validation rules are applied for fields like email, name, phoneNo, and password.
 */
export declare class CreateAdminDto {
    email: string;
    name: string;
    password: string;
    status?: number;
    roles?: Array<string>;
}
/**
 * DTO for updating an existing admin.
 * Allows partial updates by making all fields optional.
 */
export declare class UpdateAdminDto {
    email?: string;
    name?: string;
    password?: string;
    status?: number;
    roles?: Array<string>;
}
/**
 * DTO for updating the password.
 */
export declare class UpdateAdminPasswordDto {
    newPassword: string;
    confirmNewPassword: string;
}
