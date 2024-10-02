"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchConstraint = void 0;
exports.Match = Match;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
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
exports.MatchConstraint = MatchConstraint;
exports.MatchConstraint = MatchConstraint = tslib_1.__decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: false })
], MatchConstraint);
function Match(property, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: MatchConstraint,
        });
    };
}
//# sourceMappingURL=match.decorator.js.map