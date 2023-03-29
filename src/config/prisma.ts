import { PrismaClient } from '@prisma/client';
import config from './config';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient: PrismaClient = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
if (config.node_env !== 'production') globalThis.prisma = prismaClient;

export default prismaClient;
