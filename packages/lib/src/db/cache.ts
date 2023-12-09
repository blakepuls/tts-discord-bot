import { Redis } from 'ioredis';
import chalk from 'chalk';
import config from '@config';
import { log } from '../utils';

interface CacheObject<T> {
  data: T;
  expires: number;
}

const lightGray = chalk.rgb(175, 175, 175);

const getTime = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

function debug(message: string) {
  if (config.logging.level !== 'debug') return;
  if (config.logging.console) {
    console.log(
      lightGray(`[${chalk.rgb(19, 171, 171)('DEBUG')}] `) +
        chalk.gray.bold(getTime()) +
        lightGray(' ' + message),
    );
  }
}

function getByteSize(obj: any) {
  return Buffer.byteLength(JSON.stringify(obj), 'utf-8');
}

export default class CacheClient {
  client: Redis;
  expirationCallbacks: Map<string, () => void>;

  constructor() {
    this.client = new Redis({
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_URL,
      port: Number(process.env.REDIS_PORT),
    });

    this.expirationCallbacks = new Map();
    this.setupExpirationListener();
  }

  async connect(): Promise<void> {
    if (this.client.status === 'ready') return;
    if (this.client.status === 'connecting')
      return new Promise((resolve) => this.client.once('connect', resolve));
    await new Promise(async (resolve) => {
      await this.client.connect();
      this.client.on('connect', () => {
        log.debug('Connected to redis server');
        resolve(true);
      });
    });
  }

  async get<T>(type: string, id: string): Promise<CacheObject<T> | null> {
    try {
      const key = `${type}:${id}`;
      const dataType = this.getDataType(key);
      if (dataType === 'json') {
        const data = (await this.client.call('JSON.GET', key)) as string;
        if (!data) return null;
        log.debug(`Cache.get: ${key} (${getByteSize(data)} Bytes)`);
        return {
          expires: await this.client.ttl(key),
          data: JSON.parse(data),
        };
      }
      const data = (await this.client.get(key)) as any;
      log.debug(`Cache.get: ${key} (${getByteSize(data)} Bytes)`);
      return {
        expires: await this.client.ttl(key),
        data: data,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async set<T>(
    type: string,
    options: { id: string; expires: number; data: T },
  ): Promise<void> {
    try {
      const key = `${type}:${options.id}`;
      const dataType = this.getDataType(key);
      if (dataType === 'json') {
        await this.client.call(
          'JSON.SET',
          key,
          '.',
          JSON.stringify(options.data),
        );
      } else {
        await this.client.set(key, options.data as any);
      }
      if (options.expires) {
        await this.client.expire(key, options.expires);
      }
      debug(`Cache.set: ${key} (${getByteSize(options.data)} Bytes)`);
    } catch (err) {
      console.error(err);
    }
  }

  // ... continuation from previous part ...

  getDataType(key: string): 'json' | 'hash' {
    try {
      // Determine the data type based on the data structure or key pattern
      // Example logic (you can customize this based on your requirements)
      if (key.includes('json')) return 'json';
      return 'hash'; // default to 'hash' or add more conditions as needed
    } catch (err) {
      console.error(err);
      return 'json'; // default to 'json' on error
    }
  }

  async delete(type: string, id: string): Promise<void> {
    debug(`Cache.delete: ${type}:${id}`);
    try {
      const key = `${type}:${id}`;
      await this.client.del(key);
    } catch (err) {
      console.error(err);
    }
  }

  async clear(): Promise<void> {
    await this.client.flushall();
  }

  setupExpirationListener(): void {
    const eventChannel = `__keyevent@0__:expired`;
    const expirationSubscriber = new Redis({
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_URL,
      port: Number(process.env.REDIS_PORT),
    });
    expirationSubscriber.config('SET', 'notify-keyspace-events', 'Ex');
    expirationSubscriber.subscribe(eventChannel);
    expirationSubscriber.on('message', async (channel, message) => {
      if (channel === eventChannel) {
        const callback = this.expirationCallbacks.get(message);
        if (callback) {
          await callback();
          this.expirationCallbacks.delete(message);
        }
      }
    });
  }

  addExpirationCallback(
    key: string,
    onExpiration: () => void | Promise<void>,
  ): void {
    this.expirationCallbacks.set(key, onExpiration);
  }

  removeExpirationCallback(key: string): void {
    this.expirationCallbacks.delete(key);
  }
}
