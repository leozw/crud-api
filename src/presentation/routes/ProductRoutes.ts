import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export class ProductRoutes {
  private router: Router;
  private controller: ProductController;

  constructor(controller: ProductController) {
    this.router = Router();
    this.controller = controller;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', (req, res) => this.controller.getAll(req, res));
    this.router.get('/category/:category', (req, res) => this.controller.getByCategory(req, res));
    this.router.get('/:id', (req, res) => this.controller.getById(req, res));
    this.router.post('/', (req, res) => this.controller.create(req, res));
    this.router.put('/:id', (req, res) => this.controller.update(req, res));
    this.router.patch('/:id', (req, res) => this.controller.partialUpdate(req, res));
    this.router.delete('/:id', (req, res) => this.controller.delete(req, res));
  }

  getRouter(): Router {
    return this.router;
  }
}

