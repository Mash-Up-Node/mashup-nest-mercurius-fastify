import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { PostCreateInput } from './post-create.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateOnePostArgs {

    @Field(() => PostCreateInput, {nullable:false})
    @Type(() => PostCreateInput)
    data!: PostCreateInput;
}
