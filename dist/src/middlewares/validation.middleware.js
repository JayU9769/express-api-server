"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ValidationMiddleware", {
    enumerable: true,
    get: function() {
        return ValidationMiddleware;
    }
});
const _classtransformer = require("class-transformer");
const _classvalidator = require("class-validator");
const _HttpException = require("../exceptions/HttpException");
const _helper = require("../config/helper");
const ValidationMiddleware = (type, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false)=>{
    return async (req, res, next)=>{
        const dto = (0, _classtransformer.plainToInstance)(type, req.body);
        try {
            await (0, _classvalidator.validateOrReject)(dto, {
                skipMissingProperties,
                whitelist,
                forbidNonWhitelisted
            });
            req.body = dto;
            next();
        } catch (errors) {
            if (Array.isArray(errors)) {
                const formattedErrors = flattenValidationErrors(errors);
                const message = formattedErrors[0];
                next(new _HttpException.HttpException(422, message));
            } else {
                next(errors);
            }
        }
    };
};
function flattenValidationErrors(errors, parentProperty = '') {
    return errors.flatMap((error)=>{
        const propertyName = parentProperty ? `${(0, _helper.capitalize)(parentProperty)} > ${(0, _helper.capitalize)(error.property)}` : error.property;
        const currentErrorMessages = error.constraints ? Object.values(error.constraints).map((message)=>`${propertyName}: ${message}`) : [];
        const childErrorMessages = error.children ? flattenValidationErrors(error.children, propertyName) : [];
        return [
            ...currentErrorMessages,
            ...childErrorMessages
        ];
    });
}

//# sourceMappingURL=validation.middleware.js.map