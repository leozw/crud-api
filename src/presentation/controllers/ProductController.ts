import { Request, Response } from 'express';
import { GetAllProductsUseCase } from '../../application/use-cases/product/GetAllProductsUseCase';
import { GetProductByIdUseCase } from '../../application/use-cases/product/GetProductByIdUseCase';
import { GetProductsByCategoryUseCase } from '../../application/use-cases/product/GetProductsByCategoryUseCase';
import { CreateProductUseCase } from '../../application/use-cases/product/CreateProductUseCase';
import { UpdateProductUseCase } from '../../application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from '../../application/use-cases/product/DeleteProductUseCase';
import { ProductQuery, ProductSortField } from '../../domain/entities/Product';

export class ProductController {
  constructor(
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const query: ProductQuery = {
      filters: {},
    };

    if (req.query.minPrice) {
      query.filters!.minPrice = parseFloat(req.query.minPrice as string);
    }

    if (req.query.maxPrice) {
      query.filters!.maxPrice = parseFloat(req.query.maxPrice as string);
    }

    if (req.query.sortBy) {
      query.sortBy = req.query.sortBy as ProductSortField;
    }

    const products = await this.getAllProductsUseCase.execute(query);

    res.json({
      total: products.length,
      products,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    const product = await this.getProductByIdUseCase.execute(id);
    res.json(product);
  }

  async getByCategory(req: Request, res: Response): Promise<void> {
    const category = req.params.category;
    const products = await this.getProductsByCategoryUseCase.execute(category);

    res.json({
      category,
      total: products.length,
      products,
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    const product = await this.createProductUseCase.execute(req.body);

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    const product = await this.updateProductUseCase.execute(id, req.body);

    res.json({
      message: 'Product updated successfully',
      product,
    });
  }

  async partialUpdate(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    const product = await this.updateProductUseCase.execute(id, req.body);

    res.json({
      message: 'Product updated successfully',
      product,
    });
  }

  async delete(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    await this.deleteProductUseCase.execute(id);

    res.json({
      message: 'Product deleted successfully',
    });
  }

  async getApiInfo(_req: Request, res: Response): Promise<void> {
    res.json({
      message: 'Product Management API',
      version: '1.0.0',
      endpoints: {
        'GET /products': 'List all products (supports filtering and sorting)',
        'GET /products/:id': 'Get a specific product by ID',
        'GET /products/category/:category': 'Get products by category',
        'POST /products': 'Create a new product',
        'PUT /products/:id': 'Update a product (full replacement)',
        'PATCH /products/:id': 'Update a product (partial update)',
        'DELETE /products/:id': 'Delete a product',
      },
      queryParams: {
        '/products': {
          minPrice: 'Filter by minimum price',
          maxPrice: 'Filter by maximum price',
          sortBy: 'Sort by field (name, price, stock, category)',
        },
      },
    });
  }
}

