import { Field } from '@nestjs/graphql';
import { InputType } from '@nestjs/graphql';
import { PostCreateManyAuthorInput } from './post-create-many-author.input';
import { Type } from 'class-transformer';

@InputType()
export class PostCreateManyAuthorInputEnvelope {

    @Field(() => [PostCreateManyAuthorInput], {nullable:false})
    @Type(() => PostCreateManyAuthorInput)
    data!: Array<PostCreateManyAuthorInput>;

    @Field(() => Boolean, {nullable:true})
    skipDuplicates?: boolean;
}
