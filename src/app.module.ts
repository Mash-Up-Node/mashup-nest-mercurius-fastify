import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
