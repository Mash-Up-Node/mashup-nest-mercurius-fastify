import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserNotFoundException } from 'src/common/exception';
import { UserObject } from './dto/user.object';
import { UserCreateInput } from './dto/user-create.input';
import { UserUpdateInput } from './dto/user-update.input';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserObject])
  throwUserNotFoundError() {
    throw new UserNotFoundException({ name: '주병호' });
  }

  @Query(() => [UserObject])
  async findAllUserList() {
    return this.userService.findAll();
  }

  @Query(() => UserObject)
  async findUserById(@Args('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Mutation(() => UserObject)
  async createUser(@Args('data') data: UserCreateInput) {
    return this.userService.createOne(data);
  }

  @Mutation(() => UserObject)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UserUpdateInput,
  ) {
    return this.userService.updateOne(id, data);
  }

  @Mutation(() => UserObject)
  async deleteUserById(@Args('id') id: string) {
    return this.userService.deleteOneById(id);
  }
}
