import { Module } from '@nestjs/common';
import { PrismaIncludeInterceptor } from './prisma-select.interceptor';
import { GraphQLSchemaHost } from '@nestjs/graphql';

@Module({
  providers: [GraphQLSchemaHost, PrismaIncludeInterceptor],
  exports: [PrismaIncludeInterceptor],
})
export class PrismaQueryModule {}
