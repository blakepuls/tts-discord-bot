-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('SHOP', 'USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('UPDATE_USER', 'UPDATE_GUILD', 'UPDATE_SHOP', 'UPDATE_ITEM');

-- CreateEnum
CREATE TYPE "UserAction" AS ENUM ('PURCHASE_ITEM', 'TRANSFER_MONEY');

-- CreateEnum
CREATE TYPE "ShopAction" AS ENUM ('PURCHASE', 'PURCHASE_FAIL');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "logs" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guilds" (
    "id" TEXT NOT NULL,
    "multiplier" INTEGER NOT NULL DEFAULT 1,
    "shopChannelId" TEXT,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_users" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" INTEGER DEFAULT 0,
    "level" INTEGER DEFAULT 0,
    "xp" INTEGER DEFAULT 0,
    "lastWork" TIMESTAMP(3),
    "lastCrime" TIMESTAMP(3),
    "guildId" TEXT,

    CONSTRAINT "guild_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_modules" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "guild_modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_logs" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "guild_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_admin_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AdminAction" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildLogsId" TEXT,

    CONSTRAINT "guild_admin_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_user_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "UserAction" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildLogsId" TEXT,

    CONSTRAINT "guild_user_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_shop_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "ShopAction" NOT NULL,
    "message" TEXT NOT NULL,
    "commands" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildLogsId" TEXT NOT NULL,

    CONSTRAINT "guild_shop_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_servers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "game" TEXT NOT NULL,
    "rconPort" INTEGER,
    "rconPass" TEXT,
    "guildId" TEXT,

    CONSTRAINT "guild_servers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "game" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "guildId" TEXT,
    "guildServerId" TEXT,

    CONSTRAINT "guild_shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_shop_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 1,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "guild_shop_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_shop_item_commands" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "prompts" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "guild_shop_item_commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_modules_work" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "multiplier" INTEGER NOT NULL DEFAULT 1,
    "cooldown" INTEGER NOT NULL DEFAULT 10,
    "guildModuleId" TEXT NOT NULL,

    CONSTRAINT "guild_modules_work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guild_modules_crime" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "multiplier" INTEGER NOT NULL DEFAULT 1,
    "cooldown" INTEGER NOT NULL DEFAULT 10,
    "risk" DECIMAL(65,30) NOT NULL DEFAULT 1,
    "guildModuleId" TEXT NOT NULL,

    CONSTRAINT "guild_modules_crime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "guilds_id_key" ON "guilds"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_users_id_key" ON "guild_users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_users_userId_guildId_key" ON "guild_users"("userId", "guildId");

-- CreateIndex
CREATE UNIQUE INDEX "guild_modules_id_key" ON "guild_modules"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_modules_guildId_key" ON "guild_modules"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "guild_logs_id_key" ON "guild_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_logs_guildId_key" ON "guild_logs"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "guild_admin_logs_id_key" ON "guild_admin_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_user_logs_id_key" ON "guild_user_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shop_logs_id_key" ON "guild_shop_logs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_servers_id_key" ON "guild_servers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_servers_guildId_id_key" ON "guild_servers"("guildId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_servers_guildId_name_key" ON "guild_servers"("guildId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shops_id_key" ON "guild_shops"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shops_guildId_id_key" ON "guild_shops"("guildId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shops_guildId_name_key" ON "guild_shops"("guildId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shop_items_id_key" ON "guild_shop_items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shop_items_shopId_name_key" ON "guild_shop_items"("shopId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shop_items_shopId_id_key" ON "guild_shop_items"("shopId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_shop_item_commands_id_key" ON "guild_shop_item_commands"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_modules_work_id_key" ON "guild_modules_work"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_modules_work_guildModuleId_key" ON "guild_modules_work"("guildModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "guild_modules_crime_id_key" ON "guild_modules_crime"("id");

-- CreateIndex
CREATE UNIQUE INDEX "guild_modules_crime_guildModuleId_key" ON "guild_modules_crime"("guildModuleId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_users" ADD CONSTRAINT "guild_users_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_modules" ADD CONSTRAINT "guild_modules_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_logs" ADD CONSTRAINT "guild_logs_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_admin_logs" ADD CONSTRAINT "guild_admin_logs_guildLogsId_fkey" FOREIGN KEY ("guildLogsId") REFERENCES "guild_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_user_logs" ADD CONSTRAINT "guild_user_logs_guildLogsId_fkey" FOREIGN KEY ("guildLogsId") REFERENCES "guild_logs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_shop_logs" ADD CONSTRAINT "guild_shop_logs_guildLogsId_fkey" FOREIGN KEY ("guildLogsId") REFERENCES "guild_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_servers" ADD CONSTRAINT "guild_servers_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_shops" ADD CONSTRAINT "guild_shops_guildServerId_fkey" FOREIGN KEY ("guildServerId") REFERENCES "guild_servers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_shops" ADD CONSTRAINT "guild_shops_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_shop_items" ADD CONSTRAINT "guild_shop_items_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "guild_shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_shop_item_commands" ADD CONSTRAINT "guild_shop_item_commands_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "guild_shop_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_modules_work" ADD CONSTRAINT "guild_modules_work_guildModuleId_fkey" FOREIGN KEY ("guildModuleId") REFERENCES "guild_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guild_modules_crime" ADD CONSTRAINT "guild_modules_crime_guildModuleId_fkey" FOREIGN KEY ("guildModuleId") REFERENCES "guild_modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
