"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdminPasswordDto = exports.UpdateAdminDto = exports.CreateAdminDto = exports.UpdatePasswordDto = exports.UpdateProfileDto = exports.LoginAdminDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const match_decorator_1 = require("./match.decorator");
class LoginAdminDto {
}
exports.LoginAdminDto = LoginAdminDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], LoginAdminDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(32),
    tslib_1.__metadata("design:type", String)
], LoginAdminDto.prototype, "password", void 0);
// DTO for updating profile
class UpdateProfileDto {
}
exports.UpdateProfileDto = UpdateProfileDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], UpdateProfileDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
// DTO for updating password
class UpdatePasswordDto {
}
exports.UpdatePasswordDto = UpdatePasswordDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdatePasswordDto.prototype, "currentPassword", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    tslib_1.__metadata("design:type", String)
], UpdatePasswordDto.prototype, "newPassword", void 0);
/**
 * DTO for creating a new admin.
 * Ensures validation rules are applied for fields like email, name, phoneNo, and password.
 */
class CreateAdminDto {
}
exports.CreateAdminDto = CreateAdminDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateAdminDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateAdminDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], CreateAdminDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0, { message: 'Status must be 0 or 1' }),
    tslib_1.__metadata("design:type", Number)
], CreateAdminDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateAdminDto.prototype, "roles", void 0);
/**
 * DTO for updating an existing admin.
 * Allows partial updates by making all fields optional.
 */
class UpdateAdminDto {
}
exports.UpdateAdminDto = UpdateAdminDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateAdminDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateAdminDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateAdminDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], UpdateAdminDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], UpdateAdminDto.prototype, "roles", void 0);
/**
 * DTO for updating the password.
 */
class UpdateAdminPasswordDto {
}
exports.UpdateAdminPasswordDto = UpdateAdminPasswordDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'New password is required' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password must be at least 8 characters long' }),
    tslib_1.__metadata("design:type", String)
], UpdateAdminPasswordDto.prototype, "newPassword", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Confirmation password is required' }),
    (0, class_validator_1.Validate)(match_decorator_1.Match, ['newPassword'], { message: 'Passwords do not match' }),
    tslib_1.__metadata("design:type", String)
], UpdateAdminPasswordDto.prototype, "confirmNewPassword", void 0);
//# sourceMappingURL=admin.dto.js.map