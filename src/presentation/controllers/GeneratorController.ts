import { randomInt, randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { ValidationError } from '../../domain/errors/ValidationError';

export class GeneratorController {
  private static readonly DEFAULT_BATCH_SIZE = 10;
  private static readonly MAX_BATCH_SIZE = 1000;
  private static readonly DEFAULT_MIN_NUMBER = 0;
  private static readonly DEFAULT_MAX_NUMBER = 1_000_000;
  private static readonly MAX_RANDOM_INT = 281_474_976_710_655;

  async generateUuid(_req: Request, res: Response): Promise<void> {
    this.disableCache(res);
    res.json({
      uuid: randomUUID(),
      version: 4,
    });
  }

  async generateUuidBatch(req: Request, res: Response): Promise<void> {
    const count = this.parseCount(req.query.count);
    const uuids = Array.from({ length: count }, () => randomUUID());

    this.disableCache(res);
    res.json({
      total: count,
      uuids,
      version: 4,
    });
  }

  async generateId(_req: Request, res: Response): Promise<void> {
    this.disableCache(res);
    res.json({
      id: this.createId(),
    });
  }

  async generateIdBatch(req: Request, res: Response): Promise<void> {
    const count = this.parseCount(req.query.count);
    const ids = Array.from({ length: count }, () => this.createId());

    this.disableCache(res);
    res.json({
      total: count,
      ids,
    });
  }

  async generateNumber(req: Request, res: Response): Promise<void> {
    const { min, max } = this.parseNumberRange(req.query.min, req.query.max);

    this.disableCache(res);
    res.json({
      number: this.createNumber(min, max),
      min,
      max,
    });
  }

  async generateNumberBatch(req: Request, res: Response): Promise<void> {
    const count = this.parseCount(req.query.count);
    const { min, max } = this.parseNumberRange(req.query.min, req.query.max);
    const numbers = Array.from({ length: count }, () => this.createNumber(min, max));

    this.disableCache(res);
    res.json({
      total: count,
      numbers,
      min,
      max,
    });
  }

  private disableCache(res: Response): void {
    res.set('Cache-Control', 'no-store');
  }

  private createId(): string {
    return `id_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
  }

  private createNumber(min: number, max: number): number {
    return randomInt(min, max + 1);
  }

  private parseCount(rawCount: unknown): number {
    if (rawCount === undefined) {
      return GeneratorController.DEFAULT_BATCH_SIZE;
    }

    const count = this.parseIntegerValue('count', rawCount);

    if (count < 1 || count > GeneratorController.MAX_BATCH_SIZE) {
      throw this.createValidationError(
        'count',
        `count must be an integer between 1 and ${GeneratorController.MAX_BATCH_SIZE}`
      );
    }

    return count;
  }

  private parseNumberRange(rawMin: unknown, rawMax: unknown): { min: number; max: number } {
    const min = rawMin === undefined
      ? GeneratorController.DEFAULT_MIN_NUMBER
      : this.parseIntegerValue('min', rawMin);
    const max = rawMax === undefined
      ? GeneratorController.DEFAULT_MAX_NUMBER
      : this.parseIntegerValue('max', rawMax);

    if (min < 0) {
      throw this.createValidationError('min', 'min must be greater than or equal to 0');
    }

    if (max > GeneratorController.MAX_RANDOM_INT) {
      throw this.createValidationError(
        'max',
        `max must be less than or equal to ${GeneratorController.MAX_RANDOM_INT}`
      );
    }

    if (min > max) {
      throw this.createValidationError('range', 'min must be less than or equal to max');
    }

    return { min, max };
  }

  private parseIntegerValue(field: string, rawValue: unknown): number {
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue)) {
      throw this.createValidationError(field, `${field} must be an integer`);
    }

    return parsedValue;
  }

  private createValidationError(field: string, message: string): ValidationError {
    return new ValidationError('Invalid generator parameters', [
      {
        field,
        message,
      },
    ]);
  }
}
