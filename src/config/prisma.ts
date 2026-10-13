import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('A variável DATABASE_URL não está definida no arquivo .env');
}

const adapter = new PrismaMariaDb(connectionString);

export const prisma = new PrismaClient({ adapter });