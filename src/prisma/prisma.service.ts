import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit
{
  constructor(private readonly logger = new Logger('PrismaService')) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.$on('error', (e) => {
      this.logger.error(e.message);
    });
    this.$on('info', (e) => {
      this.logger.log(e.message);
    });
    this.$on('warn', (e) => {
      this.logger.warn(e.message);
    });
    this.$on('query', (e) => {
      this.logger.log(
        `Query: ${e.query}, Params: ${e.params}, Duration: ${e.duration}ms`,
      );
    });
  }
}
