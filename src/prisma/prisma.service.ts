import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { adapter } from '../../prisma.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma client connected to database');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      console.error('Please check your DATABASE_URL environment variable');
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      console.log('✅ Prisma client disconnected from database');
    } catch (error) {
      console.error('❌ Error disconnecting from database:', error);
    }
  }
}
