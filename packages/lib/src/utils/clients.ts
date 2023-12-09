import DiscordClient from '../discord/client';
import DBClient from '../db/client';
import CacheClient from '../db/cache';
import env from './env';

env();

interface Clients {
  discord: DiscordClient | null;
  db: DBClient | null;
  cache: CacheClient | null;
}

const globalForClients = global as unknown as {
  discord: DiscordClient | null;
  db: DBClient | null;
  cache: CacheClient | null;
};

const config: ClientConfig = {
  createDiscord: false,
  createCache: false,
  createDB: false,
};

interface ClientConfig {
  createDiscord?: boolean;
  createCache?: boolean;
  createDB?: boolean;
}

export const setClientConfig = ({ createDiscord }: ClientConfig) => {
  config.createDiscord = createDiscord || false;
};

// TODO: Remove getClients
// getClientsSync is a temporary solution, the old getClients before the current
// getClients needed to be async because of the discord client, but now that
// the discord client is no longer async, getClientsSync can be used instead.

export const getClients = async (): Promise<Clients> => {
  //DiscordClient cannot run in serverless
  if (
    !globalForClients.discord &&
    process.env.SERVERLESS != '1' &&
    config.createDiscord
  ) {
    globalForClients.discord = new DiscordClient();
    globalForClients.discord.connect();
  }

  if (!globalForClients.cache && config.createCache) {
    globalForClients.cache = new CacheClient();
    globalForClients.cache.connect();
  }

  if (!globalForClients.db && config.createDB) {
    globalForClients.db = new DBClient();
  }

  return {
    discord: globalForClients.discord,
    db: globalForClients.db,
    cache: globalForClients.cache,
  };
};

export const getClientsSync = (): Clients => {
  //DiscordClient cannot run in serverless
  if (
    !globalForClients.discord &&
    process.env.SERVERLESS != '1' &&
    config.createDiscord
  ) {
    globalForClients.discord = new DiscordClient();
    globalForClients.discord.connect();
  }

  if (!globalForClients.cache) {
    globalForClients.cache = new CacheClient();
    globalForClients.cache.connect();
  }

  if (!globalForClients.db) {
    globalForClients.db = new DBClient();
  }

  return {
    discord: globalForClients.discord,
    db: globalForClients.db,
    cache: globalForClients.cache,
  };
};
