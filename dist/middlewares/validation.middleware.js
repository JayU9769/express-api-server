"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMiddleware = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const HttpException_1 = require("@/exceptions/HttpException");
const helper_1 = require("@/config/helper");
/**
 * @name ValidationMiddleware
 * @description Middleware for validating request data using class-validator and class-transformer.
 * @param type Class type for data transformation and validation
 * @param skipMissingProperties Skip missing properties in validation
 * @param whitelist Whitelist only known properties for validation
 * @param forbidNonWhitelisted Throw an error when non-whitelisted properties are present
 */
const ValidationMiddleware = (type, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
    return async (req, res, next) => {
        // Transform request body into the specified DTO type
        const dto = (0, class_transformer_1.plainToInstance)(type, req.body);
        try {
            // Validate the DTO instance
            await (0, class_validator_1.validateOrReject)(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted });
            // Validation successful, update request body with DTO and proceed
            req.body = dto;
            next();
        }
        catch (errors) {
            if (Array.isArray(errors)) {
                // Flatten and format validation errors
                const formattedErrors = flattenValidationErrors(errors);
                // Create a combined error message string
                const message = formattedErrors[0];
                // Pass the error message to the next middleware
                next(new HttpException_1.HttpException(422, message));
            }
            else {
                // Pass other errors directly to the next middleware
                next(errors);
            }
        }
    };
};
exports.ValidationMiddleware = ValidationMiddleware;
/**
 * Recursively flattens validation errors and constructs detailed error messages
 * including parent property names for better understanding.
 * @param errors Array of validation errors
 * @param parentProperty Optional parent property name
 * @returns Array of formatted error messages
 */
function flattenValidationErrors(errors, parentProperty = '') {
    return errors.flatMap((error) => {
        // Construct full property name with parent property
        const propertyName = parentProperty ? `${(0, helper_1.capitalize)(parentProperty)} > ${(0, helper_1.capitalize)(error.property)}` : error.property;
        // Collect error messages for the current property
        const currentErrorMessages = error.constraints ? Object.values(error.constraints).map((message) => `${propertyName}: ${message}`) : [];
        // Recursively handle child errors, if any
        const childErrorMessages = error.children ? flattenValidationErrors(error.children, propertyName) : [];
        // Return a combined array of current and child error messages
        return [...currentErrorMessages, ...childErrorMessages];
    });
}
//# sourceMappingURL=validation.middleware.js.map