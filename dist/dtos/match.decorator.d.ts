import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class MatchConstraint implements ValidatorConstraintInterface {
    validate(confirmNewPass: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
}
export declare function Match(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
