# Discord Bot Template

## Overview

This TypeScript-based template is tailored for building Discord bots. It’s designed with efficiency in mind, integrating tools like Prisma and Redis. The standout features include a modular event and state system, making it a robust choice for bot development.

## Inspiration

The idea for this template came from a larger project where I juggled different packages like documentation, libraries, Discord, web, and API. A monorepo structure proved invaluable for managing these components efficiently, inspiring the creation of this template.

## Key Features

- **Dynamic Module Loading**: Simplifies code organization and dependency management.
- **Redis Integration**: Enables advanced state management across bot modules.
- **Monorepo Setup**: Centralizes diverse components in a single, manageable structure.
- **Prisma ORM**: Facilitates streamlined database interactions.
- **Note**: Currently, sharding is not implemented.

## Getting Started

### Prerequisites

- Node.js
- Yarn
- Redis

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/blakepuls/monorepo-discord-bot-template.git
   ```
2. Install dependencies:
   ```
   yarn install
   ```

### Configuration

Set up the following in your `.env` file:

- `DISCORD_CLIENT_ID`: Discord application's client ID.
- `DISCORD_CLIENT_SECRET`: Discord application's client secret.
- `DISCORD_CLIENT_TOKEN`: Discord bot token.
- `DATABASE_URL`: Connection string for the database.

Database client:

- `DATABASE_URL`

Redis client:

- `REDIS_URL`: Hostname for the Redis server.
- `REDIS_PORT`: Port for the Redis server.
- `REDIS_PASSWORD`: Password for the Redis server.

Optional:

- `DEV_GUILD_ID`: Discord guild ID for development.
- `LOG_LEVEL`: Logging level with default of `INFO`, options are `ERROR`, `WARN`, `INFO`, `DEBUG`

> **Important**: Clients (Redis, Database) are disabled by default. They can be configured by calling `setClientConfig()` at the start of execution (see `discord/src/index.ts`).

### Scripts

- `yarn dev`: Launches all development servers.
- `yarn dev:discord`: Runs the Discord bot in dev mode.
- `yarn prisma:generate`: Generates the Prisma client.
- `yarn prisma:migrate`: Executes database migrations.

## Usage

This section would delve into how to create and manage modules, implement state management, and work with the database.

## Documentation

For detailed information on modules, states, and more, check the documentation:

- [Module System Documentation](#link-to-module-docs)
- [State System Documentation](#link-to-state-docs)

## Contributing

Contributions are welcome! Please adhere to the provided coding standards and pull request guidelines.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.
