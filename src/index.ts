import { InMemoryProductRepository } from './infrastructure/repositories/InMemoryProductRepository';
import { ProductValidationService } from './infrastructure/services/ProductValidationService';
import { GetAllProductsUseCase } from './application/use-cases/product/GetAllProductsUseCase';
import { GetProductByIdUseCase } from './application/use-cases/product/GetProductByIdUseCase';
import { GetProductsByCategoryUseCase } from './application/use-cases/product/GetProductsByCategoryUseCase';
import { CreateProductUseCase } from './application/use-cases/product/CreateProductUseCase';
import { UpdateProductUseCase } from './application/use-cases/product/UpdateProductUseCase';
import { DeleteProductUseCase } from './application/use-cases/product/DeleteProductUseCase';
import { ProductController } from './presentation/controllers/ProductController';
import { ExpressApp } from './presentation/ExpressApp';
import { GrpcServer } from './infrastructure/grpc/GrpcServer';
import { AppConfig } from './config/AppConfig';

// Dependency Injection Setup
const productRepository = new InMemoryProductRepository();
const validationService = new ProductValidationService();

const getAllProductsUseCase = new GetAllProductsUseCase(productRepository);
const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
const getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(productRepository);
const createProductUseCase = new CreateProductUseCase(productRepository, validationService);
const updateProductUseCase = new UpdateProductUseCase(productRepository, validationService);
const deleteProductUseCase = new DeleteProductUseCase(productRepository);

const productController = new ProductController(
  getAllProductsUseCase,
  getProductByIdUseCase,
  getProductsByCategoryUseCase,
  createProductUseCase,
  updateProductUseCase,
  deleteProductUseCase
);

// Start Express Server
const expressApp = new ExpressApp(productController);
expressApp.listen(AppConfig.PORT);

// Start gRPC Server
const grpcServer = new GrpcServer(AppConfig.GRPC_PORT);
grpcServer.start().catch((err) => {
  console.error('Failed to start gRPC server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await grpcServer.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await grpcServer.shutdown();
  process.exit(0);
});

