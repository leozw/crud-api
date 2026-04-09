import * as grpc from '@grpc/grpc-js';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';

export enum HealthStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
  SERVICE_UNKNOWN = 3,
}

interface HealthCheckRequest {
  service: string;
}

interface HealthCheckResponse {
  status: HealthStatus;
}

export class HealthService {
  private servingMap: Map<string, HealthStatus>;

  constructor() {
    this.servingMap = new Map();
    this.servingMap.set('', HealthStatus.SERVING); // overall
    this.servingMap.set('echo.EchoService', HealthStatus.SERVING);
  }

  check(
    call: ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>,
    callback: sendUnaryData<HealthCheckResponse>
  ): void {
    const service = call.request.service || '';
    const status = this.servingMap.get(service);

    if (status === undefined) {
      callback(null, { status: HealthStatus.SERVICE_UNKNOWN });
      return;
    }

    callback(null, { status });
  }

  watch(call: grpc.ServerWritableStream<HealthCheckRequest, HealthCheckResponse>): void {
    const service = call.request.service || '';
    const status = this.servingMap.get(service);
    const response: HealthCheckResponse = {
      status: status ?? HealthStatus.SERVICE_UNKNOWN,
    };

    call.write(response);
    call.end();
  }
}



