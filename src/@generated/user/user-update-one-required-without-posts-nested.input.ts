import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserCreateWithoutPostsInput } from './user-create-without-posts.input';
import { Type } from 'class-transformer';
import { UserCreateOrConnectWithoutPostsInput } from './user-create-or-connect-without-posts.input';
import { UserUpsertWithoutPostsInput } from './user-upsert-without-posts.input';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { UserUpdateToOneWithWhereWithoutPostsInput } from './user-update-to-one-with-where-without-posts.input';

@InputType()
export class UserUpdateOneRequiredWithoutPostsNestedInput {

    @Field(() => UserCreateWithoutPostsInput, {nullable:true})
    @Type(() => UserCreateWithoutPostsInput)
    create?: UserCreateWithoutPostsInput;

    @Field(() => UserCreateOrConnectWithoutPostsInput, {nullable:true})
    @Type(() => UserCreateOrConnectWithoutPostsInput)
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput;

    @Field(() => UserUpsertWithoutPostsInput, {nullable:true})
    @Type(() => UserUpsertWithoutPostsInput)
    upsert?: UserUpsertWithoutPostsInput;

    @Field(() => UserWhereUniqueInput, {nullable:true})
    @Type(() => UserWhereUniqueInput)
    connect?: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;

    @Field(() => UserUpdateToOneWithWhereWithoutPostsInput, {nullable:true})
    @Type(() => UserUpdateToOneWithWhereWithoutPostsInput)
    update?: UserUpdateToOneWithWhereWithoutPostsInput;
}
