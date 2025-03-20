import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

@Injectable()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello World';
  }
}
