import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      graphiql: true,
      autoSchemaFile: '/tmp/schema.gql',
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
