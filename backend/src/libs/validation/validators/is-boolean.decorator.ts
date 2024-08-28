import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  Validate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsBooleanValidator implements ValidatorConstraintInterface {
  validate(value: string | boolean, args: ValidationArguments): boolean {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return true
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be boolean`;
  }
}

export const IsBoolean = (validationOptions?: ValidationOptions) =>
  applyDecorators(
    Validate(IsBooleanValidator, validationOptions),
    Transform((t) => {
      if (t.value === 'true') return true;
      if (t.value === 'false') return false;
      return t.value;
    }),
  );
