import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { UserWhereInput } from './user-where.input';
import { Type } from 'class-transformer';
import { UserUpdateWithoutPostsInput } from './user-update-without-posts.input';

@InputType()
export class UserUpdateToOneWithWhereWithoutPostsInput {

    @Field(() => UserWhereInput, {nullable:true})
    @Type(() => UserWhereInput)
    where?: UserWhereInput;

    @Field(() => UserUpdateWithoutPostsInput, {nullable:false})
    @Type(() => UserUpdateWithoutPostsInput)
    data!: UserUpdateWithoutPostsInput;
}
