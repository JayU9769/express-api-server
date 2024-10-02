import { NextFunction, Request, Response } from 'express';
/**
 * @name ValidationMiddleware
 * @description Middleware for validating request data using class-validator and class-transformer.
 * @param type Class type for data transformation and validation
 * @param skipMissingProperties Skip missing properties in validation
 * @param whitelist Whitelist only known properties for validation
 * @param forbidNonWhitelisted Throw an error when non-whitelisted properties are present
 */
export declare const ValidationMiddleware: (type: any, skipMissingProperties?: boolean, whitelist?: boolean, forbidNonWhitelisted?: boolean) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
