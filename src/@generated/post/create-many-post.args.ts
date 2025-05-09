import { Field } from '@nestjs/graphql';
import { ArgsType } from '@nestjs/graphql';
import { PostCreateManyInput } from './post-create-many.input';
import { Type } from 'class-transformer';

@ArgsType()
export class CreateManyPostArgs {

    @Field(() => [PostCreateManyInput], {nullable:false})
    @Type(() => PostCreateManyInput)
    data!: Array<PostCreateManyInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
