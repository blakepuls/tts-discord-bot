declare module 'winston-logstash/lib/winston-logstash-latest' {
  import { TransportStream } from 'winston';
  import { EventEmitter } from 'events';

  export interface LogstashTransportSSLOptions {
    ssl_key?: string;
    ssl_cert?: string;
    ca?: string;
    ssl_passphrase?: string;
    rejectUnauthorized?: boolean;
  }

  export interface LogstashTransportOptions
    extends LogstashTransportSSLOptions {
    host: string;
    port: number;
    node_name?: string;
    meta?: Record<string, any>;
    ssl_enable?: boolean;
    retries?: number;
    max_connect_retries?: number;
    timeout_connect_retries?: number;
  }

  export class LogstashTransport extends TransportStream {
    constructor(options: LogstashTransportOptions);
    onError(error: Error): void;
    log(info: any, callback: Function): void;
    close(): void;
  }

  export class Manager extends EventEmitter {
    constructor(options: LogstashTransportOptions);
    log(message: string, callback: Function): void;
    close(): void;
  }

  export default LogstashTransport;
}
