import DiscordClient from '@lib/discord/client';
import { CacheTypes, CacheValue } from '@lib/types';
import Discord from 'discord.js';
import { State, createState } from '.';
import { UseState } from './State';

/**
 * Represents a module that handles a Discord event. The execute function is called when the event is triggered.
 * execute will be called with the client as the first argument, and the event arguments as the rest.
 */

export type ExtractStateData<T> = T extends State<any, infer D> ? D : unknown;

interface Cooldown {
  type: string;
  duration: number;
}

interface BaseExecuteProperties {
  client: DiscordClient;
}

export type BaseEventModule<T extends keyof Discord.ClientEvents> = {
  id?: string;
  type: 'button' | 'select' | 'command' | 'event' | 'modal';
  name?: string;
  event?: T;
  state?: State<any>;
  enabled?: boolean;
  cooldown?: Cooldown;
  balanceLock?: boolean;
  premium?: boolean;

  execute: (
    properties: BaseExecuteProperties & {
      state?: UseState<unknown>;
    },
    ...args: any
  ) => Discord.Awaitable<void>;
};

export type ButtonModule = BaseEventModule<'interactionCreate'> & {
  type: 'button';
  button: Discord.ButtonBuilder;
};

export type SelectModule = BaseEventModule<'interactionCreate'> & {
  type: 'select';
  select: Discord.SelectMenuBuilder;
};

export type CommandModule = BaseEventModule<'interactionCreate'> & {
  type: 'command';
  command: Discord.SlashCommandBuilder;
};

export type EventModule = BaseEventModule<any> & {
  type: 'event';
};

export type ModalModule = BaseEventModule<'interactionCreate'> & {
  type: 'modal';
  modal: Discord.ModalBuilder;
};

/**
 * Creates a new button module.
 * @param options An object containing the `name`, `button`, `enabled`, `state`, and `execute` properties.
 * @returns A new button module object.
 */
export function createButtonModule<State = unknown>(options: {
  name?: string;
  button: Discord.ButtonBuilder;
  enabled?: boolean;
  state?: State;
  cooldown?: Cooldown;
  balanceLock?: boolean;
  premium?: boolean;

  /**
   * The execute function is called when the button is clicked.
   * @param properties An object containing the `client` and `state` arguments.
   * @param interaction The interaction data.
   */
  execute: (
    properties: BaseExecuteProperties & {
      state: UseState<ExtractStateData<State>>;
    },
    interaction: Discord.ButtonInteraction,
  ) => Discord.Awaitable<void>;
}): ButtonModule {
  const data = options.button.data as Discord.ButtonComponentData & { custom_id: string };

  return {
    ...(options as any),
    type: 'button',
    event: 'interactionCreate',
    enabled: options.enabled ?? true,
    id: data.custom_id,
  };
}

/**
 * Creates a new select module.
 * @param options An object containing the `name`, `select`, `enabled`, `state`, and `execute` properties.
 * @returns A new select module object.
 */
export function createSelectModule<State = unknown>(options: {
  name?: string;
  select: Discord.SelectMenuBuilder;
  enabled?: boolean;
  state?: State;
  cooldown?: Cooldown;
  balanceLock?: boolean;
  premium?: boolean;

  /**
   * The execute function is called when an option is selected from the select menu.
   * @param properties An object containing the `client` and `state` arguments.
   * @param interaction The interaction data.
   */
  execute: (
    properties: BaseExecuteProperties & {
      state: UseState<ExtractStateData<State>>;
    },
    interaction: Discord.SelectMenuInteraction,
  ) => Discord.Awaitable<void>;
}): SelectModule {
  const data = options.select.data as Discord.BaseSelectMenuComponentData & {
    custom_id: string;
  };

  return {
    ...(options as any),
    type: 'select',
    event: 'interactionCreate',
    enabled: options.enabled ?? true,
    id: data.custom_id,
  };
}

/**
 * Creates a new command module.
 * @param options An object containing the `name`, `command`, `enabled`, `state`, `options`, and `execute` properties.
 * @returns A new command module object.
 */
export function createCommandModule<State = unknown>(options: {
  name?: string;
  command: Discord.SlashCommandBuilder;
  enabled?: boolean;
  state?: State;
  cooldown?: Cooldown;
  balanceLock?: boolean;
  premium?: boolean;

  /**
   * The execute function is called when the command is triggered.
   * @param properties An object containing the `client` and `state` arguments.
   * @param interaction The interaction data.
   */
  execute: (
    properties: BaseExecuteProperties & {
      state: UseState<ExtractStateData<State>>;
    },
    interaction: Discord.CommandInteraction,
  ) => Discord.Awaitable<void>;
}): CommandModule {
  return {
    ...(options as any),
    type: 'command',
    event: 'interactionCreate',
    enabled: options.enabled ?? true,
    id: options.command.name,
  };
}

/**
 * Creates a new event module.
 * @param options An object containing the `name`, `event`, `enabled`, and `execute` properties.
 * @returns A new event module object.
 */
export function createEventModule<T extends keyof Discord.ClientEvents>(options: {
  name?: string;
  event: T;
  enabled?: boolean;
  cooldown?: Cooldown;
  balanceLock?: boolean;
  premium?: boolean;

  execute: (
    properties: BaseExecuteProperties,
    ...args: Discord.ClientEvents[T]
  ) => Discord.Awaitable<void>;
}): EventModule {
  return { ...(options as any), type: 'event', enabled: options.enabled ?? true };
}

export function createModalModule<State = unknown>(options: {
  name?: string;
  modal: Discord.ModalBuilder;
  enabled?: boolean;
  state?: State;
  cooldown?: Cooldown;
  balanceLock?: boolean;
  premium?: boolean;

  execute: (
    properties: BaseExecuteProperties & {
      state: UseState<ExtractStateData<State>>;
    },
    interaction: Discord.ModalSubmitInteraction,
  ) => Discord.Awaitable<void>;
}): ModalModule {
  return {
    ...(options as any),
    type: 'modal',
    event: 'interactionCreate',
    enabled: options.enabled ?? true,
    id: options.modal.data.custom_id,
  };
}
