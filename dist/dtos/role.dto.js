"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRoleDto = exports.CreateRoleDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
/**
 * DTO for creating a new role.
 */
class CreateRoleDto {
}
exports.CreateRoleDto = CreateRoleDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Name should not be empty' }),
    tslib_1.__metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserType, { message: 'Invalid user type' }),
    (0, class_validator_1.IsOptional)() // Defaults to 'user' if not provided
    ,
    tslib_1.__metadata("design:type", String)
], CreateRoleDto.prototype, "type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'Status must be 0 or 1' }),
    (0, class_validator_1.IsOptional)() // Defaults to 1 if not provided
    ,
    tslib_1.__metadata("design:type", Number)
], CreateRoleDto.prototype, "status", void 0);
/**
 * DTO for updating an existing role.
 */
class UpdateRoleDto {
}
exports.UpdateRoleDto = UpdateRoleDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateRoleDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(client_1.UserType, { message: 'Invalid user type' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], UpdateRoleDto.prototype, "type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'Status must be 0 or 1' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", Number)
], UpdateRoleDto.prototype, "status", void 0);
//# sourceMappingURL=role.dto.js.map