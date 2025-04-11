import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from 'src/@generated/user/user.model';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { UserUpdateInput } from 'src/@generated/user/user-update.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async findAllUserList() {
    return this.userService.findAll();
  }

  @Query(() => User)
  async findUserById(@Args('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: UserCreateInput) {
    return this.userService.createOne(data);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UserUpdateInput,
  ) {
    return this.userService.updateOne(id, data);
  }

  @Mutation(() => User)
  async deleteUserById(@Args('id') id: string) {
    return this.userService.deleteOneById(id);
  }
}
