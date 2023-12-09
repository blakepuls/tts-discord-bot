import { env } from "../packages/lib/src/utils";
import { Partials } from "discord.js";
import { Config } from "../packages/lib/src/types";

const config: Config = {
  env: "test",
  logging: {
    level: "debug",
    file: true,
    database: true,
    console: true,
  },
  discord: {
    colors: {
      primary: "#551bc5",
      danger: "#ff0000",
      success: "#32a852",
      victory: "#ffcc00",
      warning: "#FF5F15", // Channel orange color? #FF7E30
    },
    client: {
      intents: ["Guilds", "GuildMessages", "GuildMessages"],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
      ],
    },
  },
  web: {},
};

export default config;
