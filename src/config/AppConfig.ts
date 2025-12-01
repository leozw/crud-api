export class AppConfig {
  static readonly PORT: number = parseInt(process.env.PORT || '3000', 10);
  static readonly GRPC_PORT: number = parseInt(process.env.GRPC_PORT || '50051', 10);
  static readonly NODE_ENV: string = process.env.NODE_ENV || 'development';
}

