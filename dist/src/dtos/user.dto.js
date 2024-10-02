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
    CreateUserDto: function() {
        return CreateUserDto;
    },
    UpdateUserDto: function() {
        return UpdateUserDto;
    },
    UpdateUserPasswordDto: function() {
        return UpdateUserPasswordDto;
    }
});
const _classvalidator = require("class-validator");
const _matchdecorator = require("./match.decorator");
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
let CreateUserDto = class CreateUserDto {
    constructor(){
        _define_property(this, "email", void 0);
        _define_property(this, "name", void 0);
        _define_property(this, "phoneNo", void 0);
        _define_property(this, "password", void 0);
        _define_property(this, "status", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "phoneNo", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    (0, _classvalidator.Min)(0, {
        message: 'Status must be 0 or 1'
    }),
    _ts_metadata("design:type", Number)
], CreateUserDto.prototype, "status", void 0);
let UpdateUserDto = class UpdateUserDto {
    constructor(){
        _define_property(this, "email", void 0);
        _define_property(this, "name", void 0);
        _define_property(this, "phoneNo", void 0);
        _define_property(this, "password", void 0);
        _define_property(this, "status", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsEmail)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "email", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsPhoneNumber)(null),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "phoneNo", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.MinLength)(6),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
_ts_decorate([
    (0, _classvalidator.IsInt)(),
    (0, _classvalidator.IsOptional)(),
    _ts_metadata("design:type", Number)
], UpdateUserDto.prototype, "status", void 0);
let UpdateUserPasswordDto = class UpdateUserPasswordDto {
    constructor(){
        _define_property(this, "newPassword", void 0);
        _define_property(this, "confirmNewPassword", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'New password is required'
    }),
    (0, _classvalidator.MinLength)(8, {
        message: 'Password must be at least 8 characters long'
    }),
    _ts_metadata("design:type", String)
], UpdateUserPasswordDto.prototype, "newPassword", void 0);
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)({
        message: 'Confirmation password is required'
    }),
    (0, _classvalidator.Validate)(_matchdecorator.Match, [
        'newPassword'
    ], {
        message: 'Passwords do not match'
    }),
    _ts_metadata("design:type", String)
], UpdateUserPasswordDto.prototype, "confirmNewPassword", void 0);

//# sourceMappingURL=user.dto.js.map