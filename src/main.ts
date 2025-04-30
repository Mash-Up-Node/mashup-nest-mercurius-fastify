import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { GraphQLFormattedError } from 'graphql';

export interface NestApp {
  app: NestFastifyApplication;
  instance: FastifyInstance;
}

const GRAPHQL_HEADER_KEY = 'application/graphql-response+json';

export const bootstrapServer = async (): Promise<NestApp> => {
  const serverOptions: FastifyServerOptions = {
    logger: true,
  };

  const instance: FastifyInstance = fastify(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
  );

  instance.addHook('onRequest', (request, reply, done) => {
    if (request.url.startsWith('/graphql')) {
      const accept = request.headers.accept || '';
      if (!accept.includes(GRAPHQL_HEADER_KEY)) {
        return reply.status(406).send({
          data: null,
          extension: null,
          errors: [
            {
              message:
                'Not Acceptable: Server supports application/graphql-response+json only.',
            },
          ] as ReadonlyArray<GraphQLFormattedError>,
        });
      }
    }
    done();
  });

  instance.addHook('onSend', (request, reply, _, done) => {
    if (request.url.startsWith('/graphql')) {
      reply.type(GRAPHQL_HEADER_KEY);
    }
    done();
  });

  await app.init();
  return { app, instance };
};

const bootstrap = async (): Promise<void> => {
  const { app } = await bootstrapServer();
  const port = process.env.PORT || 8000;
  await app.listen(port);
};

void bootstrap();
