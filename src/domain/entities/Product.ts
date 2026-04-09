export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
}

export type ProductSortField = 'name' | 'price' | 'stock' | 'category';

export interface ProductQuery {
  filters?: ProductFilters;
  sortBy?: ProductSortField;
}



