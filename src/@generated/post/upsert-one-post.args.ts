import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { PostWhereUniqueInput } from './post-where-unique.input';
import { Type } from 'class-transformer';
import { PostCreateInput } from './post-create.input';
import { PostUpdateInput } from './post-update.input';

@ArgsType()
export class UpsertOnePostArgs {

    @Field(() => PostWhereUniqueInput, {nullable:false})
    @Type(() => PostWhereUniqueInput)
    where!: Prisma.AtLeast<PostWhereUniqueInput, 'id'>;

    @Field(() => PostCreateInput, {nullable:false})
    @Type(() => PostCreateInput)
    create!: PostCreateInput;

    @Field(() => PostUpdateInput, {nullable:false})
    @Type(() => PostUpdateInput)
    update!: PostUpdateInput;
}
