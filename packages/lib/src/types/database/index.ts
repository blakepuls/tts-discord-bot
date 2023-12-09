import Prisma from '@prisma/client';

interface GuildServerStatus {
  online?: boolean;
  maxPlayers?: number;
  players?: number;
  name?: string;
}

// Wrapped types for Prisma.
export interface GuildServer extends Prisma.GuildServer {
  status?: GuildServerStatus;
}
export interface GuildModules
  extends Prisma.Prisma.GuildModuleGetPayload<{
    include: {
      Work: true;
    };
  }> {}
export interface Guild extends Prisma.Guild {
  servers?: GuildServer[];
  modules?: GuildModules;
}

export interface GuildUpdate
  extends Partial<Omit<Guild, 'channels' | 'servers' | 'modules'>> {}

export interface GuildUser extends Prisma.GuildUser {}

export interface GuildShop extends Prisma.GuildShop {
  items?: GuildShopItem[];
  server?: GuildServer;
}

export interface GuildShopItem extends Prisma.GuildShopItem {
  commands?: GuildShopItemCommand[];
}

export interface GuildShopItemCommand extends Prisma.GuildShopItemCommand {}

export interface GuildLogs extends Prisma.GuildLogs {}
export interface GuildAdminLogs extends Prisma.GuildAdminLogs {}
export interface GuildUserLogs extends Prisma.GuildUserLogs {}
export interface GuildShopLogs extends Prisma.GuildShopLogs {}

export type AdminAction = Prisma.AdminAction;
export type UserAction = Prisma.UserAction;
export type ShopAction = Prisma.ShopAction;

export const AdminAction = Prisma.AdminAction;
export const UserAction = Prisma.UserAction;
export const ShopAction = Prisma.ShopAction;
