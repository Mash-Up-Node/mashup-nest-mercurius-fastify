import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get('NODE_ENV') !== 'production';
        const SCHEMA_FILE_NAME = 'graphql-schema.gql';
        return {
          graphiql: true,
          autoSchemaFile: (isDev ? `./src/` : '/tmp/') + SCHEMA_FILE_NAME,
        };
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
