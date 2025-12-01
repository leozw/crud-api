import * as grpc from '@grpc/grpc-js';
import * as path from 'path';
import * as protoLoader from '@grpc/proto-loader';
import { HealthService } from './services/HealthService';
import { EchoService } from './services/EchoService';

export class GrpcServer {
  private server: grpc.Server;
  private port: number;

  constructor(port: number = 50051) {
    this.port = port;
    this.server = new grpc.Server();
  }

  private loadProto(protoFile: string): any {
    const packageDefinition = protoLoader.loadSync(protoFile, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    return grpc.loadPackageDefinition(packageDefinition);
  }

  private registerServices(): void {
    // Use process.cwd() to get the project root, works in both dev and production
    const protoDir = path.join(process.cwd(), 'protos');
    const healthProtoPath = path.join(protoDir, 'health.proto');
    const echoProtoPath = path.join(protoDir, 'echo.proto');

    const healthDef = this.loadProto(healthProtoPath);
    const echoDef = this.loadProto(echoProtoPath);

    const healthServiceImpl = new HealthService();
    const echoServiceImpl = new EchoService();

    // Register Health service
    const healthServiceDef = healthDef.grpc?.health?.v1?.Health;
    if (healthServiceDef?.service) {
      this.server.addService(healthServiceDef.service, {
        Check: healthServiceImpl.check.bind(healthServiceImpl),
        Watch: healthServiceImpl.watch.bind(healthServiceImpl),
      });
    } else {
      throw new Error('Health service definition not found');
    }

    // Register Echo service
    const echoServiceDef = echoDef.echo?.EchoService;
    if (echoServiceDef?.service) {
      this.server.addService(echoServiceDef.service, {
        Echo: echoServiceImpl.echo.bind(echoServiceImpl),
      });
    } else {
      throw new Error('Echo service definition not found');
    }
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.registerServices();

      const bindAddr = `0.0.0.0:${this.port}`;
      this.server.bindAsync(
        bindAddr,
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
          if (err) {
            reject(err);
            return;
          }

          this.server.start();
          this.logStartup(port);
          resolve();
        }
      );
    });
  }

  private logStartup(port: number): void {
    console.log('╔════════════════════════════════════════╗');
    console.log('║        📡 gRPC Test Server (Node)     ║');
    console.log('╚════════════════════════════════════════╝');
    console.log(`🔌 gRPC listening on 0.0.0.0:${port}`);
    console.log('   • Health: grpc.health.v1.Health/Check { service: "" | "echo.EchoService" }');
    console.log('   • Echo:   echo.EchoService/Echo { message: string }');
  }

  async shutdown(): Promise<void> {
    return new Promise((resolve) => {
      this.server.tryShutdown(() => {
        resolve();
      });
    });
  }
}

