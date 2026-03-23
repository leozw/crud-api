import express, { Express } from 'express';
import { GeneratorController } from './controllers/GeneratorController';
import { ProductController } from './controllers/ProductController';
import { GeneratorRoutes } from './routes/GeneratorRoutes';
import { ProductRoutes } from './routes/ProductRoutes';
import { RequestLogger } from './middlewares/RequestLogger';
import { NotFoundHandler } from './middlewares/NotFoundHandler';
import { ErrorHandler } from './middlewares/ErrorHandler';

export class ExpressApp {
  private app: Express;

  constructor(productController: ProductController, generatorController: GeneratorController) {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes(productController, generatorController);
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(RequestLogger.middleware);
  }

  private setupRoutes(productController: ProductController, generatorController: GeneratorController): void {
    // Root route
    this.app.get('/', (req, res) => productController.getApiInfo(req, res));

    // Product routes
    const productRoutes = new ProductRoutes(productController);
    this.app.use('/products', productRoutes.getRouter());

    // Generator routes
    const generatorRoutes = new GeneratorRoutes(generatorController);
    this.app.use(generatorRoutes.getRouter());
  }

  private setupErrorHandling(): void {
    this.app.use(NotFoundHandler.handle);
    this.app.use(ErrorHandler.handle);
  }

  getApp(): Express {
    return this.app;
  }

  listen(port: number, callback?: () => void): void {
    this.app.listen(port, () => {
      this.logStartup(port);
      if (callback) {
        callback();
      }
    });
  }

  private logStartup(port: number): void {
    console.log('╔════════════════════════════════════════╗');
    console.log('║   🚀 Product Management API Server    ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`📡 Server running on http://localhost:${port}`);
    console.log(`📚 API documentation: http://localhost:${port}`);
    console.log(`🛠️  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
    console.log('Press CTRL+C to stop');
  }
}

