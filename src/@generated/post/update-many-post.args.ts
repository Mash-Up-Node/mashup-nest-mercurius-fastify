import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { PostUpdateManyMutationInput } from './post-update-many-mutation.input';
import { Type } from 'class-transformer';
import { PostWhereInput } from './post-where.input';
import { Int } from '@nestjs/graphql';

@ArgsType()
export class UpdateManyPostArgs {

    @Field(() => PostUpdateManyMutationInput, {nullable:false})
    @Type(() => PostUpdateManyMutationInput)
    data!: PostUpdateManyMutationInput;

    @Field(() => PostWhereInput, {nullable:true})
    @Type(() => PostWhereInput)
    where?: PostWhereInput;

    @Field(() => Int, {nullable:true})
    limit?: number;
}
