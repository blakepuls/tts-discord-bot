// Path alias setup
import 'module-alias/register';

// External library imports
import path from 'path';
import glob from 'glob';
import { ActivityType, Interaction } from 'discord.js';

// Internal library imports
import { getClients, log, phrases, setClientConfig } from '@lib/utils';
import DiscordClient from '@lib/discord/client';
import { embeds } from '@lib/discord';

// Type imports
import { BaseEventModule, CommandModule, EventModule } from './types/EventModule';
import { createUseState } from './utils';

// Don't need cache or db for this bot.
setClientConfig({
  createDiscord: true,
});

/**
 * Get all exports from .module.ts files, and filter out any disabled modules.
 * @param pattern
 * @returns
 */
async function importModules(pattern: string) {
  const { discord } = await getClients();

  const files = glob.sync(pattern, { cwd: path.join(__dirname, 'modules') });
  const modules = await Promise.all(
    files.map(async (file) => {
      const exports = await import(path.join(__dirname, 'modules', file));

      const filteredModules = Object.keys(exports)
        .map((key) => {
          return { ...exports[key], name: key };
        })
        .filter((module) => typeof module.execute === 'function') as BaseEventModule<any>[];

      return filteredModules;
    }),
  );

  return modules.flat().filter((module) => {
    if (!module.enabled) log.warn(`Module ${module.name} is disabled`);

    // Register command module here:
    if (module.type === 'command') {
      registerCommandModule(discord!, module as CommandModule);
    }

    return module.enabled && module.name !== 'default';
  });
}

/**
 * Retrieves all module files, defined by .{event,command,button,selectMenu}.ts files.
 */
async function getModules() {
  const modules = await importModules('**/*.module.{ts,js}');

  modules.forEach((module) => {
    log.debug(`Loaded ${module.type} module: ${module.name}`);
  });

  return {
    modals: modules.filter((module) => module.type === 'modal'),
    buttons: modules.filter((module) => module.type === 'button'),
    commands: modules.filter((module) => module.type === 'command'),
    events: modules.filter((module) => module.type === 'event'),
    selects: modules.filter((module) => module.type === 'select'),
  };
}

/**
 * Registers all event modules, this will only register one listener per event.
 */
async function registerEvents(discord: DiscordClient, modules: Array<BaseEventModule<any>>) {
  const uniqueEvents = new Set<string>(modules.map((module) => module.event));

  for (const event of uniqueEvents) {
    discord.on(event, (...args) => {
      log.debug(`Event fired: ${event}`);

      modules
        .filter((module) => module.event === event && module.enabled)
        .forEach(async (module) => {
          if (module.event === 'guildCreate' || module.event === 'guildDelete') {
            // Can't use guilds() here because the guild doesn't exist yet.
            // @ts-ignore
            module.execute({ client: discord }, ...args);
            return;
          }

          module.execute({ client: discord }, ...args);
        });
    });
  }
}

/**
 *  Register a command module to the Discord API.
 */
function registerCommandModule(client: DiscordClient, module: CommandModule) {
  if (module.type !== 'command' || !module.id) return;

  if (process.env.NODE_ENV === 'development') {
    if (!process.env.DEV_GUILD_ID) throw new Error('DEV_GUILD_ID not set in .env');

    if (!module.enabled) {
      client.guilds.cache.get(process.env.DEV_GUILD_ID)?.commands.cache.get(module.id)?.delete();
      return;
    }

    client.guilds.cache.get(process.env.DEV_GUILD_ID)?.commands.create(module.command);
    return;
  }

  if (!module.enabled) {
    client.application?.commands.cache.get(module.id)?.delete();
    return;
  }

  client.application?.commands.create(module.command);
}

/**
 * Find an **interaction** module from an interaction.
 */
const findModule = (interaction: Interaction, interactionModules: any[]) => {
  return interactionModules.find((module) => {
    if (interaction.isCommand() && module.type === 'command') {
      return module.id === interaction.commandName;
    }

    if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
      const data = module[module.type].data;
      if (!data || !data.custom_id) return false;
      return data.custom_id === interaction.customId;
    }

    return false;
  });
};

const handleCooldown = async (interaction: Interaction, module: any, cache: any) => {
  const cooldown = parseInt(
    (await cache.client.hget(`cooldown:${interaction.user.id}`, module.cooldown.type)) || '0',
  );

  if (cooldown) {
    const remaining = cooldown - Date.now();

    if (remaining > 0 && interaction.isRepliable()) {
      interaction.reply({
        embeds: [embeds.warn(phrases.cooldown(remaining))],
        ephemeral: true,
      });

      return true;
    }
  }

  return false;
};

const handleInteractionCreate = async (
  discord: DiscordClient,
  interaction: Interaction,
  interactionModules: any[],
  cache: any,
) => {
  if (!interaction.guild) return;

  if (interaction.isCommand()) {
    const ongoingCommandKey = `${interaction.user.id}:${interaction.commandName}`;
    if (ongoingCommands.has(ongoingCommandKey)) {
      if (interaction.isRepliable()) {
        interaction.reply({
          embeds: [embeds.error('Please wait for your current command to finish.')],
          ephemeral: true,
        });
      }
      return;
    }
  }

  const module = findModule(interaction, interactionModules);
  if (!module) return;

  if (module.cooldown) {
    const isCooldown = await handleCooldown(interaction, module, cache);
    if (isCooldown) return;
  }

  const state = module.state ? await createUseState(module.state, interaction.user.id) : undefined;

  interaction.isCommand() &&
    ongoingCommands.add(`${interaction.user.id}:${interaction.commandName}`);

  try {
    await module.execute({ client: discord, state }, interaction);

    log.info(`Executed ${module.type} module: ${module.name}`, {});

    if (interaction.isCommand())
      ongoingCommands.delete(`${interaction.user.id}:${interaction.commandName}`);

    // Set cooldown
    if (module.cooldown) {
      const key = `cooldown:${interaction.user.id}`;
      const type = module.cooldown.type;

      await cache.client.hset(key, type, Date.now() + module.cooldown.duration);
    }
  } catch (error: any) {
    log.error(error, {
      interaction: interaction.toJSON(),
    });

    if (interaction.isRepliable()) {
      interaction.reply({
        embeds: [embeds.error('An error occurred while processing this interaction.')],
        ephemeral: true,
      });
    }

    // Delete the command from the ongoingCommands set even if an error occurs
    if (interaction.isCommand()) {
      ongoingCommands.delete(`${interaction.user.id}:${interaction.commandName}`);
    }
  }
};

const ongoingCommands = new Set<string>();

const main = async () => {
  const { discord, cache } = await getClients();

  if (!discord) throw new Error('Discord client not created');

  await new Promise((resolve) => {
    discord.once('ready', resolve);
  });

  discord.user?.setPresence({
    activities: [
      {
        name: `v${process.env.npm_package_version}`,
        type: ActivityType.Playing,
      },
    ],
  });

  log.success('Logged into Discord as ' + discord.user?.tag);

  const { commands, events, buttons, selects, modals } = await getModules();

  registerEvents(discord, events);

  const interactionModules = [...commands, ...buttons, ...selects, ...modals];

  discord.on('interactionCreate', async (interaction) => {
    try {
      handleInteractionCreate(discord, interaction, interactionModules, cache);
    } catch (error) {
      log.error(error, {
        interaction: interaction.toJSON(),
      });

      interaction.isRepliable() &&
        interaction.reply({
          embeds: [embeds.error('An error occurred while executing this command.')],
          ephemeral: true,
        });

      if (interaction.isCommand())
        ongoingCommands.delete(`${interaction.user.id}:${interaction.commandName}`);
    }
  });
};

main();
