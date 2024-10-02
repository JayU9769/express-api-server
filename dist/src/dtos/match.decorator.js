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
    Match: function() {
        return Match;
    },
    MatchConstraint: function() {
        return MatchConstraint;
    }
});
const _classvalidator = require("class-validator");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let MatchConstraint = class MatchConstraint {
    validate(confirmNewPass, args) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = args.object[relatedPropertyName];
        return confirmNewPass === relatedValue;
    }
    defaultMessage(args) {
        return 'Passwords do not match';
    }
};
MatchConstraint = _ts_decorate([
    (0, _classvalidator.ValidatorConstraint)({
        async: false
    })
], MatchConstraint);
function Match(property, validationOptions) {
    return function(object, propertyName) {
        (0, _classvalidator.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [
                property
            ],
            validator: MatchConstraint
        });
    };
}

//# sourceMappingURL=match.decorator.js.map