import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@/exceptions/HttpException';
import { capitalize } from '@/config/helper';

/**
 * @name ValidationMiddleware
 * @description Middleware for validating request data using class-validator and class-transformer.
 * @param type Class type for data transformation and validation
 * @param skipMissingProperties Skip missing properties in validation
 * @param whitelist Whitelist only known properties for validation
 * @param forbidNonWhitelisted Throw an error when non-whitelisted properties are present
 */
export const ValidationMiddleware = (type: any, skipMissingProperties = false, whitelist = false, forbidNonWhitelisted = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Transform request body into the specified DTO type
    const dto = plainToInstance(type, req.body);

    try {
      // Validate the DTO instance
      await validateOrReject(dto, { skipMissingProperties, whitelist, forbidNonWhitelisted });

      // Validation successful, update request body with DTO and proceed
      req.body = dto;
      next();
    } catch (errors) {
      if (Array.isArray(errors)) {
        // Flatten and format validation errors
        const formattedErrors = flattenValidationErrors(errors);

        // Create a combined error message string
        const message = formattedErrors[0];

        // Pass the error message to the next middleware
        next(new HttpException(422, message));
      } else {
        // Pass other errors directly to the next middleware
        next(errors);
      }
    }
  };
};

/**
 * Recursively flattens validation errors and constructs detailed error messages
 * including parent property names for better understanding.
 * @param errors Array of validation errors
 * @param parentProperty Optional parent property name
 * @returns Array of formatted error messages
 */
function flattenValidationErrors(errors: ValidationError[], parentProperty = ''): string[] {
  return errors.flatMap((error: ValidationError) => {
    // Construct full property name with parent property
    const propertyName = parentProperty ? `${capitalize(parentProperty)} > ${capitalize(error.property)}` : error.property;

    // Collect error messages for the current property
    const currentErrorMessages = error.constraints ? Object.values(error.constraints).map((message: string) => `${propertyName}: ${message}`) : [];

    // Recursively handle child errors, if any
    const childErrorMessages = error.children ? flattenValidationErrors(error.children, propertyName) : [];

    // Return a combined array of current and child error messages
    return [...currentErrorMessages, ...childErrorMessages];
  });
}
