import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'Hello World';
  }
}
