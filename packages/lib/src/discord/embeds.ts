import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Embed,
  EmbedBuilder,
  EmbedField,
  EmbedFooterOptions,
  resolveColor,
} from 'discord.js';
import Discord from 'discord.js';
import { Colors } from '../utils';

const Icons = {
  success: 'https://cdn.discordapp.com/emojis/854202202202429460.png?v=1',
  error: 'https://cdn.discordapp.com/emojis/854202202202429460.png?v=1',
  cancel: 'https://cdn.discordapp.com/emojis/854202202202429460.png?v=1',
};

/**
 * Create custom embed
 * @typedef options
 * @property Thumbnail
 * @property title - Title and icon of the embed
 * @property description
 * @property color - Hex color

 */
export function custom(options: {
  color?: string;
  message?: string;
  thumbnail?: string;
  fields?: EmbedField[];
  footer?: EmbedFooterOptions;
  title?:
    | string
    | {
        text: string;
        iconURL?: string;
      };
}): Embed {
  const embed: any = new EmbedBuilder();
  embed.setColor(Colors.Primary);

  options.thumbnail && embed.setThumbnail(options.thumbnail);
  options.fields && embed.addFields(options.fields || []);
  options.message && embed.setDescription(options.message);
  options.footer && embed.setFooter(options.footer);

  if (options.title) {
    if (typeof options.title === 'string') {
      embed.setTitle(options.title);
    } else {
      embed.setAuthor({
        name: options.title.text,
        iconURL: options.title.iconURL || undefined,
      });
    }
  }

  return embed;
}

/**
 * Create success embed
 * @param message
 * @param color - Hex color
 */
export function success(message: string): Embed {
  const embed: any = new EmbedBuilder();
  embed.setColor(Colors.Success);
  // embed.setTitle('Success');
  embed.setDescription(message);
  return embed;
}

/**
 * Create an error embed
 * @param message
 */
export function error(message: string): Embed {
  const embed: any = new EmbedBuilder();
  embed.setColor(Colors.Danger);
  embed.setDescription(message);
  return embed;
}

/**
 * Create a warning embed
 * @param message
 */
export function warn(message: string): Embed {
  const embed: any = new EmbedBuilder();
  embed.setColor(Colors.Warning);
  embed.setDescription(message);
  return embed;
}

/**
 * @deprecated
 */
export function reward(params: {
  avatarURL?: string | null;
  money: number;
  moneyBonus: number;
  xp: number;
  levelUp: boolean;
}) {
  const embed = new EmbedBuilder()
    .setDescription(
      `You worked and earned \`$${params.money}${
        params.moneyBonus ? ` (+${params.moneyBonus} Level bonus)` : ''
      }\``,
    )
    .setFooter({
      text: params.levelUp
        ? `🌟 You leveled up! Use /levelup`
        : `✨ Gained ${params.xp} XP`,
      iconURL: params.avatarURL ?? undefined,
    })
    .setColor(params.levelUp ? Colors.Victory : Colors.Primary);

  // params.levelUp && embed.setTitle('Level Up Available');

  return embed;
}
