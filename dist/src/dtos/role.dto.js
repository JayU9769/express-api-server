"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    CreateRoleDto: function() {
        return CreateRoleDto;
    },
    UpdateRoleDto: function() {
        return UpdateRoleDto;
    }
});
const _classvalidator = require("class-validator");
const _client = require("@prisma/client");
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
let CreateRoleDto = class CreateRoleDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "type", void 0);
        _define_property(this, "status", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Name should not be empty'
    }),
    _ts_metadata("design:type", String)
], CreateRoleDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_client.UserType, {
        message: 'Invalid user type'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _client.UserType === "undefined" ? Object : _client.UserType)
], CreateRoleDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(0, {
        message: 'Status must be 0 or 1'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], CreateRoleDto.prototype, "status", void 0);
let UpdateRoleDto = class UpdateRoleDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "type", void 0);
        _define_property(this, "status", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateRoleDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsEnum)(_client.UserType, {
        message: 'Invalid user type'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", typeof _client.UserType === "undefined" ? Object : _client.UserType)
], UpdateRoleDto.prototype, "type", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.Min)(0, {
        message: 'Status must be 0 or 1'
    }),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateRoleDto.prototype, "status", void 0);

//# sourceMappingURL=role.dto.js.map