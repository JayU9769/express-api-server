"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePermissionRequestDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
// Define Role DTO for validation
class RoleDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RoleDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RoleDTO.prototype, "name", void 0);
// Define Permission DTO for validation
class PermissionDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PermissionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PermissionDTO.prototype, "name", void 0);
class UpdatePermissionRequestDto {
}
exports.UpdatePermissionRequestDto = UpdatePermissionRequestDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], UpdatePermissionRequestDto.prototype, "value", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => RoleDTO) // Use RoleDTO for validation
    ,
    tslib_1.__metadata("design:type", RoleDTO)
], UpdatePermissionRequestDto.prototype, "role", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PermissionDTO) // Use PermissionDTO for validation
    ,
    tslib_1.__metadata("design:type", PermissionDTO)
], UpdatePermissionRequestDto.prototype, "permission", void 0);
//# sourceMappingURL=permission.dto.js.map