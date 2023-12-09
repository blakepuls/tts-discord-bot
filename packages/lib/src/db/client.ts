import { PrismaClient } from '@prisma/client';
import config from '@config';
import { log } from '../utils';

export default class DBClient extends PrismaClient {
  constructor() {
    // If there's no db url, then don't create a client
    if (!process.env.DATABASE_URL) {
      super();
      return;
    }

    super();

    if (config.logging.level === 'debug') {
      this.$use(async (params, next) => {
        const result = await next(params);
        log.debug(`Prisma: ${params.model}.${params.action}`);
        return result;
      });
    }
  }
}
