import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FieldAccessInterceptor } from './field-access.interceptor';
import { GraphQLSchemaHost } from '@nestjs/graphql';

@Module({
  imports: [],
  providers: [
    GraphQLSchemaHost,
    { provide: APP_INTERCEPTOR, useClass: FieldAccessInterceptor },
  ],
})
export class FieldAccessModule {}
