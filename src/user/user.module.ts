import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { PrismaIncludeInterceptor } from '../common/prisma-query/prisma-select.interceptor';

@Module({
  imports: [PrismaModule],
  providers: [
    UserResolver,
    UserService,
    GraphQLSchemaHost,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (schemaHost: GraphQLSchemaHost) => {
        return new PrismaIncludeInterceptor(schemaHost, {
          posts: 'posts', // User 모델의 관계 매핑
        });
      },
      inject: [GraphQLSchemaHost],
    },
  ],
})
export class UserModule {}
