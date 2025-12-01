import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IProductValidationService } from '../../../domain/services/IProductValidationService';
import { Product, CreateProductDto } from '../../../domain/entities/Product';
import { ValidationError } from '../../../domain/errors/ValidationError';

export class CreateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly validationService: IProductValidationService
  ) {}

  async execute(data: CreateProductDto): Promise<Product> {
    const errors = this.validationService.validateCreate(data);
    
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    return this.productRepository.create(data);
  }
}

