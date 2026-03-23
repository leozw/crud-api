import { Router } from 'express';
import { GeneratorController } from '../controllers/GeneratorController';

export class GeneratorRoutes {
  private router: Router;
  private controller: GeneratorController;

  constructor(controller: GeneratorController) {
    this.router = Router();
    this.controller = controller;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/uuid', (req, res) => this.controller.generateUuid(req, res));
    this.router.get('/uuid/batch', (req, res) => this.controller.generateUuidBatch(req, res));
    this.router.get('/id', (req, res) => this.controller.generateId(req, res));
    this.router.get('/id/batch', (req, res) => this.controller.generateIdBatch(req, res));
    this.router.get('/number', (req, res) => this.controller.generateNumber(req, res));
    this.router.get('/number/batch', (req, res) => this.controller.generateNumberBatch(req, res));
  }

  getRouter(): Router {
    return this.router;
  }
}
