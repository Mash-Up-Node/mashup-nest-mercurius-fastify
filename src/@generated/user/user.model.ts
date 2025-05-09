import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { ID } from '@nestjs/graphql';
import { Role } from '../prisma/role.enum';
import { Post } from '../post/post.model';
import { UserCount } from './user-count.output';

@ObjectType()
export class User {

    @Field(() => ID, {nullable:false})
    id!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:false})
    nickname!: string;

    @Field(() => String, {nullable:false})
    password!: string;

    @Field(() => Role, {defaultValue:'USER',nullable:false})
    role!: `${Role}`;

    @Field(() => [Post], {nullable:true})
    posts?: Array<Post>;

    @Field(() => UserCount, {nullable:false})
    _count?: UserCount;
}
