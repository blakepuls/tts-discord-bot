import DiscordClient from './client';

export async function getUser(client: DiscordClient, userId: string) {
  try {
    const user =
      client.users.cache.get(userId) ?? (await client.users.fetch(userId));
    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
}

interface EmojiOptions {
  size?: number;
  animated?: boolean;
}

export function emojiUrl(
  emojiId: string,
  { animated, size }: EmojiOptions = {},
) {
  return `https://cdn.discordapp.com/emojis/${emojiId}${
    animated ? '.gif' : '.png'
  }?size=${size ?? 128}&quality=lossless`;
}
