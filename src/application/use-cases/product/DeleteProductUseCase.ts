import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { NotFoundError } from '../../../domain/errors/NotFoundError';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    
    if (!product) {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }

    await this.productRepository.delete(id);
  }
}



