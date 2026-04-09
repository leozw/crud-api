import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Product, CreateProductDto, UpdateProductDto, ProductQuery } from '../../domain/entities/Product';

export class InMemoryProductRepository implements IProductRepository {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      price: 999.99,
      stock: 15,
      category: 'Electronics',
      description: 'High-performance laptop for work and gaming',
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      price: 29.99,
      stock: 50,
      category: 'Accessories',
      description: 'Ergonomic wireless mouse with precision tracking',
    },
    {
      id: 3,
      name: 'Mechanical Keyboard',
      price: 79.99,
      stock: 30,
      category: 'Accessories',
      description: 'RGB mechanical keyboard with blue switches',
    },
    {
      id: 4,
      name: 'USB-C Hub',
      price: 49.99,
      stock: 25,
      category: 'Accessories',
      description: '7-in-1 USB-C hub with HDMI and SD card reader',
    },
  ];

  private nextId = 5;

  async findAll(query?: ProductQuery): Promise<Product[]> {
    let result = [...this.products];

    if (query?.filters) {
      const { minPrice, maxPrice, category } = query.filters;

      if (minPrice !== undefined) {
        result = result.filter((p) => p.price >= minPrice);
      }

      if (maxPrice !== undefined) {
        result = result.filter((p) => p.price <= maxPrice);
      }

      if (category) {
        result = result.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    if (query?.sortBy) {
      const field = query.sortBy;
      result.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        }

        return 0;
      });
    }

    return result;
  }

  async findById(id: number): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  async create(data: CreateProductDto): Promise<Product> {
    const newProduct: Product = {
      id: this.nextId++,
      name: data.name,
      price: data.price,
      stock: data.stock,
      category: data.category,
      description: data.description || '',
    };

    this.products.push(newProduct);
    return newProduct;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const existingProduct = this.products[index];
    const updatedProduct: Product = {
      ...existingProduct,
      ...data,
      id: existingProduct.id, // Ensure ID cannot be changed
    };

    this.products[index] = updatedProduct;
    return updatedProduct;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      return false;
    }

    this.products.splice(index, 1);
    return true;
  }
}



