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
    DeleteActionDto: function() {
        return DeleteActionDto;
    },
    UpdateActionDto: function() {
        return UpdateActionDto;
    }
});
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
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
let UpdateFieldDto = class UpdateFieldDto {
    constructor(){
        _define_property(this, "name", void 0);
        _define_property(this, "value", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsString)(),
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", String)
], UpdateFieldDto.prototype, "name", void 0);
_ts_decorate([
    (0, _classvalidator.IsNotEmpty)(),
    _ts_metadata("design:type", Object)
], UpdateFieldDto.prototype, "value", void 0);
let UpdateActionDto = class UpdateActionDto {
    constructor(){
        _define_property(this, "ids", void 0);
        _define_property(this, "field", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsNotEmpty)({
        each: true
    }),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], UpdateActionDto.prototype, "ids", void 0);
_ts_decorate([
    (0, _classvalidator.IsObject)(),
    (0, _classvalidator.ValidateNested)(),
    (0, _classtransformer.Type)(()=>UpdateFieldDto),
    _ts_metadata("design:type", typeof UpdateFieldDto === "undefined" ? Object : UpdateFieldDto)
], UpdateActionDto.prototype, "field", void 0);
let DeleteActionDto = class DeleteActionDto {
    constructor(){
        _define_property(this, "ids", void 0);
    }
};
_ts_decorate([
    (0, _classvalidator.IsArray)(),
    (0, _classvalidator.IsNotEmpty)({
        each: true
    }),
    _ts_metadata("design:type", typeof Array === "undefined" ? Object : Array)
], DeleteActionDto.prototype, "ids", void 0);

//# sourceMappingURL=global.dto.js.map