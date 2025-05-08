import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post, User } from '@prisma/client';
import { UserObject } from 'src/user/dto/user.object';

@ObjectType()
export class PostObject implements Omit<Post, 'author' | 'authorId'> {
  @Field(() => ID, { nullable: false })
  id: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date;

  @Field(() => String, { nullable: false })
  title: string;

  @Field(() => String, { nullable: true })
  content: string | null;

  @Field(() => UserObject, { nullable: false })
  author: User;

  @Field(() => String)
  authorId: string;
}
