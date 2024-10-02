"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteActionDto = exports.UpdateActionDto = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateFieldDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], UpdateFieldDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", Object)
], UpdateFieldDto.prototype, "value", void 0);
class UpdateActionDto {
}
exports.UpdateActionDto = UpdateActionDto;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], UpdateActionDto.prototype, "ids", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UpdateFieldDto),
    tslib_1.__metadata("design:type", UpdateFieldDto)
], UpdateActionDto.prototype, "field", void 0);
class DeleteActionDto {
}
exports.DeleteActionDto = DeleteActionDto;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], DeleteActionDto.prototype, "ids", void 0);
//# sourceMappingURL=global.dto.js.map