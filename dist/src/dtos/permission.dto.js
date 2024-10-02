"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UpdatePermissionRequestDto", {
    enumerable: true,
    get: function() {
        return UpdatePermissionRequestDto;
    }
});
const _classvalidator = require("class-validator");
const _classtransformer = require("class-transformer");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let RoleDTO = class RoleDTO {
    constructor(){
        _define_property(this, "id", void 0);
        _define_property(this, "name", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RoleDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], RoleDTO.prototype, "name", void 0);
let PermissionDTO = class PermissionDTO {
    constructor(){
        _define_property(this, "id", void 0);
        _define_property(this, "name", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PermissionDTO.prototype, "id", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    _ts_metadata("design:type", String)
], PermissionDTO.prototype, "name", void 0);
let UpdatePermissionRequestDto = class UpdatePermissionRequestDto {
    constructor(){
        _define_property(this, "value", void 0);
        _define_property(this, "role", void 0);
        _define_property(this, "permission", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsNumber)(),
    _ts_metadata("design:type", Number)
], UpdatePermissionRequestDto.prototype, "value", void 0);
_ts_decorate([
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>RoleDTO),
    _ts_metadata("design:type", typeof RoleDTO === "undefined" ? Object : RoleDTO)
], UpdatePermissionRequestDto.prototype, "role", void 0);
_ts_decorate([
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>PermissionDTO),
    _ts_metadata("design:type", typeof PermissionDTO === "undefined" ? Object : PermissionDTO)
], UpdatePermissionRequestDto.prototype, "permission", void 0);

//# sourceMappingURL=permission.dto.js.map