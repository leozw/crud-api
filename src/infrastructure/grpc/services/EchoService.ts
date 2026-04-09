import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';

interface EchoRequest {
  message: string;
}

interface EchoResponse {
  message: string;
  timestamp_unix_ms: number;
}

export class EchoService {
  echo(
    call: ServerUnaryCall<EchoRequest, EchoResponse>,
    callback: sendUnaryData<EchoResponse>
  ): void {
    const message = call.request.message || '';
    const response: EchoResponse = {
      message,
      timestamp_unix_ms: Date.now(),
    };

    callback(null, response);
  }
}



