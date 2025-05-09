import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserUpdateWithoutPostsInput } from './user-update-without-posts.input';
import { Type } from 'class-transformer';
import { UserCreateWithoutPostsInput } from './user-create-without-posts.input';
import { UserWhereInput } from './user-where.input';

@InputType()
export class UserUpsertWithoutPostsInput {

    @Field(() => UserUpdateWithoutPostsInput, {nullable:false})
    @Type(() => UserUpdateWithoutPostsInput)
    update!: UserUpdateWithoutPostsInput;

    @Field(() => UserCreateWithoutPostsInput, {nullable:false})
    @Type(() => UserCreateWithoutPostsInput)
    create!: UserCreateWithoutPostsInput;

    @Field(() => UserWhereInput, {nullable:true})
    @Type(() => UserWhereInput)
    where?: UserWhereInput;
}
