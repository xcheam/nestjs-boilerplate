import { ValidationOptions, ValidationArguments, registerDecorator } from 'class-validator'

export function FunctionValidate (
  fn: (value: any) => boolean,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'functionValidate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: any, args: ValidationArguments) => fn(value)
      }
    })
  }
}
