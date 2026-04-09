import { Product, CreateProductDto, UpdateProductDto, ProductQuery } from '../entities/Product';

export interface IProductRepository {
  findAll(query?: ProductQuery): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  create(data: CreateProductDto): Promise<Product>;
  update(id: number, data: UpdateProductDto): Promise<Product>;
  delete(id: number): Promise<boolean>;
}



