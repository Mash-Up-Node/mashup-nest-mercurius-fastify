import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserWhereUniqueInput } from './user-where-unique.input';
import { Type } from 'class-transformer';
import { UserCreateWithoutPostsInput } from './user-create-without-posts.input';

@InputType()
export class UserCreateOrConnectWithoutPostsInput {

    @Field(() => UserWhereUniqueInput, {nullable:false})
    @Type(() => UserWhereUniqueInput)
    where!: Prisma.AtLeast<UserWhereUniqueInput, 'id' | 'email'>;

    @Field(() => UserCreateWithoutPostsInput, {nullable:false})
    @Type(() => UserCreateWithoutPostsInput)
    create!: UserCreateWithoutPostsInput;
}
