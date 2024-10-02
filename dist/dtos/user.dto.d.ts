/**
 * DTO for creating a new user.
 * Ensures validation rules are applied for fields like email, name, phoneNo, and password.
 */
export declare class CreateUserDto {
    email: string;
    name: string;
    phoneNo: string;
    password: string;
    status?: number;
}
/**
 * DTO for updating an existing user.
 * Allows partial updates by making all fields optional.
 */
export declare class UpdateUserDto {
    email?: string;
    name?: string;
    phoneNo?: string;
    password?: string;
    status?: number;
}
/**
 * DTO for updating the password.
 */
export declare class UpdateUserPasswordDto {
    newPassword: string;
    confirmNewPassword: string;
}
