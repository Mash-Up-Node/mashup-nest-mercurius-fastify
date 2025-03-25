import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';

interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

const bootstrapServer = async (): Promise<NestApp> => {
  const serverOptions: FastifyServerOptions = {
    logger: true,
  };

  const instance: FastifyInstance = fastify(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
  );

  await app.init();
  return { app, instance };
};

const bootstrap = async (): Promise<void> => {
  const { app } = await bootstrapServer();
  const port = process.env.PORT || 8000;
  await app.listen(port);
};

void bootstrap();
