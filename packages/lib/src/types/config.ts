import { ClientOptions } from 'discord.js';

interface Discord {
  colors?: Partial<{
    primary: string;
    danger: string;
    success: string;
    victory: string;
    warning: string;
  }>;
  client: ClientOptions;
}

interface Web {
  port?: number;
}

export interface Config {
  env: string;
  logging: Partial<{
    level: 'debug' | 'info';
    database: boolean;
    console: boolean;
    file: boolean;
  }>;
  discord: Discord;
  web: Web;
}

declare const config: Config;
