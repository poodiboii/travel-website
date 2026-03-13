// prisma.config.ts
// Place this file in the ROOT of your server folder (same level as package.json)

import 'dotenv/config';  // Loads your .env file (DATABASE_URL etc.)

import { defineConfig, env } from 'prisma/config';  // ← correct import (without @prisma/ in most cases)

export default defineConfig({
  schema: './prisma/schema.prisma',          // forward slash is fine on Windows

  migrations: {
    path: './prisma/migrations',             // quoted string
  },

  datasource: {
    url: env('DATABASE_URL'),                // throws helpful error if missing → good
  },
});