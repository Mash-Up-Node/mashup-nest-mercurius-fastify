import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutPostsInput } from './user-create-without-posts.input';
import { Type } from 'class-transformer';
import { UserCreateOrConnectWithoutPostsInput } from './user-create-or-connect-without-posts.input';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';

@InputType()
export class UserCreateNestedOneWithoutPostsInput {

    @Field(() => UserCreateWithoutPostsInput, {nullable:true})
    @Type(() => UserCreateWithoutPostsInput)
    create?: UserCreateWithoutPostsInput;

    @Field(() => UserCreateOrConnectWithoutPostsInput, {nullable:true})
    @Type(() => UserCreateOrConnectWithoutPostsInput)
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput;

    @Field(() => UserWhereUniqueInput, {nullable:true})
    @Type(() => UserWhereUniqueInput)
    connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;
}
