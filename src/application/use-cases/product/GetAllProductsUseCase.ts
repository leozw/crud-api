import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product, ProductQuery } from '../../../domain/entities/Product';

export class GetAllProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(query?: ProductQuery): Promise<Product[]> {
    return this.productRepository.findAll(query);
  }
}

