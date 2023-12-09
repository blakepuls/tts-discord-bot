import { ActivityType, Client } from 'discord.js';
import config from '@config';

export default class DiscordClient extends Client {
  /** A record of all the handlers for this client. */
  public _handlers: Record<string, any>;

  constructor() {
    super({
      // intents: config.discord.client.intents,
      ...config.discord.client,
      // presence: {
      //   activities: [
      //     {
      //       name: `v${process.env.npm_package_version}`,
      //       type: ActivityType.Playing,
      //     },
      //   ],
      // },
    });
    this._handlers = {};
  }
  /**
   * Connects to Discord if not already connected.
   *
   * @returns A Promise that resolves when the connection is established.
   */
  async connect(): Promise<void> {
    if (this.ws.status === 0) return;

    await this.login(process.env.DISCORD_CLIENT_TOKEN);
    // this.user?.setStatus('invisible');
  }

  /**
   * Registers a handler for an event.
   */
  registerHandler(event: string, handler: (...args: any[]) => Promise<void>) {
    this._handlers[event] = handler;
  }
}
/**
   * Unregisters a handler for an event.
   * 
}

// /**
//  * Creates a new Discord client, also logs in.
//  * @returns {Promise<Client>} The Discord client
//  */
// export async function createClient(): Promise<Client> {
//   const client = new Client({
//     // intents: config.discord.client.intents,
//     ...config.discord.client,
//   });
//   await client.login(process.env.DISCORD_CLIENT_TOKEN);
//   return client;
// }
