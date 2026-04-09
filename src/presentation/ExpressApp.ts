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

    // Webhook route for testing (like webhook.site)
    this.app.all('/webhook', (req, res) => {
      console.log('\n--- 🪝 WEBHOOK PAYLOAD RECEIVED ---');
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
      console.log('Headers:', JSON.stringify(req.headers, null, 2));
      console.log('Query:', JSON.stringify(req.query, null, 2));
      console.log('Body:', JSON.stringify(req.body, null, 2));
      console.log('------------------------------------\n');
      
      res.status(200).json({
        message: 'Webhook received successfully',
        method: req.method,
        timestamp: new Date().toISOString()
      });
    });
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

