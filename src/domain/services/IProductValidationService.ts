import { CreateProductDto, UpdateProductDto } from '../entities/Product';

export interface ValidationError {
  field: string;
  message: string;
}

export interface IProductValidationService {
  validateCreate(data: CreateProductDto): ValidationError[];
  validateUpdate(data: UpdateProductDto): ValidationError[];
}



