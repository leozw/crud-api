import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IProductValidationService } from '../../../domain/services/IProductValidationService';
import { Product, UpdateProductDto } from '../../../domain/entities/Product';
import { NotFoundError } from '../../../domain/errors/NotFoundError';
import { ValidationError } from '../../../domain/errors/ValidationError';

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly validationService: IProductValidationService
  ) {}

  async execute(id: number, data: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    
    if (!existingProduct) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    const errors = this.validationService.validateUpdate(data);
    
    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    return this.productRepository.update(id, data);
  }
}

