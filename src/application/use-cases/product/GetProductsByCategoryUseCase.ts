import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { Product } from '../../../domain/entities/Product';

export class GetProductsByCategoryUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(category: string): Promise<Product[]> {
    return this.productRepository.findByCategory(category);
  }
}



