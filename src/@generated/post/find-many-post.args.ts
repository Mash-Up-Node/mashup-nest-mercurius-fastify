import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { PostWhereInput } from './post-where.input';
import { Type } from 'class-transformer';
import { PostOrderByWithRelationInput } from './post-order-by-with-relation.input';
import { Prisma } from '@prisma/client';
import { PostWhereUniqueInput } from './post-where-unique.input';
import { Int } from '@nestjs/graphql';
import { PostScalarFieldEnum } from './post-scalar-field.enum';

@ArgsType()
export class FindManyPostArgs {

    @Field(() => PostWhereInput, {nullable:true})
    @Type(() => PostWhereInput)
    where?: PostWhereInput;

    @Field(() => [PostOrderByWithRelationInput], {nullable:true})
    orderBy?: Array<PostOrderByWithRelationInput>;

    @Field(() => PostWhereUniqueInput, {nullable:true})
    cursor?: Prisma.AtLeast<PostWhereUniqueInput, 'id'>;

    @Field(() => Int, {nullable:true})
    take?: number;

    @Field(() => Int, {nullable:true})
    skip?: number;

    @Field(() => [PostScalarFieldEnum], {nullable:true})
    distinct?: Array<`${PostScalarFieldEnum}`>;
}
