import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserObject } from './dto/user.object';
import { UserCreateInput } from './dto/user-create.input';
import { UserUpdateInput } from './dto/user-update.input';

@Resolver(() => UserObject)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserObject])
  async findAllUserList(@Context() context: any) {
    // 컨텍스트에서 Prisma include 객체 가져오기
    // APP_INTERCEPTOR로 등록된 PrismaIncludeInterceptor가 자동으로 처리
    const prismaInclude = context.prismaInclude;
    return this.userService.findAll(prismaInclude);
  }

  @Query(() => UserObject, { nullable: true })
  async findUserById(
    @Args('id') id: string,
    @Context() context: any,
  ) {
    const prismaInclude = context.prismaInclude;
    return this.userService.findOneById(id, prismaInclude);
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