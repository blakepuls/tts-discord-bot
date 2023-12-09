import config from '@config';

/**
 * Resolve a hex color to decimal, supporting # and without.
 */
export const resolveHex = (hex: string): number => {
  return parseInt(hex.replace('#', ''), 16);
};

export enum Colors {
  Primary = resolveHex(config.discord.colors?.primary || '#7289da'),
  Danger = resolveHex(config.discord.colors?.danger || '#ff0000'),
  Success = resolveHex(config.discord.colors?.success || '#32a852'),
  Victory = resolveHex(config.discord.colors?.victory || '#ffcc00'),
  Warning = resolveHex(config.discord.colors?.warning || '#ffcc00'),
}
