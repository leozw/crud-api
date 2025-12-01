import { IProductValidationService, ValidationError } from '../../domain/services/IProductValidationService';
import { CreateProductDto, UpdateProductDto } from '../../domain/entities/Product';

export class ProductValidationService implements IProductValidationService {
  validateCreate(data: CreateProductDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'name is required' });
    }

    if (data.price === undefined || data.price === null) {
      errors.push({ field: 'price', message: 'price is required' });
    } else if (data.price <= 0) {
      errors.push({ field: 'price', message: 'price must be greater than zero' });
    }

    if (data.stock === undefined || data.stock === null) {
      errors.push({ field: 'stock', message: 'stock is required' });
    } else if (data.stock < 0) {
      errors.push({ field: 'stock', message: 'stock cannot be negative' });
    }

    if (!data.category || data.category.trim().length === 0) {
      errors.push({ field: 'category', message: 'category is required' });
    }

    return errors;
  }

  validateUpdate(data: UpdateProductDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (data.name !== undefined && data.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'name cannot be empty' });
    }

    if (data.price !== undefined) {
      if (data.price <= 0) {
        errors.push({ field: 'price', message: 'price must be greater than zero' });
      }
    }

    if (data.stock !== undefined) {
      if (data.stock < 0) {
        errors.push({ field: 'stock', message: 'stock cannot be negative' });
      }
    }

    if (data.category !== undefined && data.category.trim().length === 0) {
      errors.push({ field: 'category', message: 'category cannot be empty' });
    }

    return errors;
  }
}

