import { AnyZodObject } from 'zod';
import { ValidationError } from '../../interfaces';
export const validateArgs = async (schema: AnyZodObject, args: Record<string, any>) => {
  try {
    return await schema.parseAsync(args);
  } catch (error: any) {
    const errors: string = error.issues.reduce((acumulator: string, { message }: any, index: number) => {
      if (index === 0) {
        return message;
      } else if (index === error.issues.length - 1) {
        return `${acumulator} and ${message}`;
      } else {
        return `${acumulator}, ${message}`;
      }
    }, '');
    throw new ValidationError(errors);
  }
};
