import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create adapter for PrismaClient
const pool = new Pool({ connectionString });
export const adapter = new PrismaPg(pool);

// Export datasource configuration for Prisma Migrate
export default {
  datasource: {
    url: connectionString,
  },
};
