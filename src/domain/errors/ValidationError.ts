import { ValidationError as DomainValidationError } from '../services/IProductValidationService';

export class ValidationError extends Error {
  public readonly errors: DomainValidationError[];

  constructor(message: string, errors: DomainValidationError[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}



