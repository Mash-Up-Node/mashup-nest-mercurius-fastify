import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Post, Role, User } from '@prisma/client';
import { ID } from '@nestjs/graphql';
import { FieldAccess } from 'src/common/field-access/field-access.decorator';

import { registerEnumType } from '@nestjs/graphql';
import { PostObject } from 'src/post/dto/post.object';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
export class UserObject implements User {
  @Field(() => ID, { nullable: false })
  @FieldAccess()
  id: string;

  @Field(() => Date, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: false })
  updatedAt: Date;

  @Field(() => String, { nullable: false })
  @FieldAccess(Role.ADMIN)
  email: string;

  @Field(() => String, { nullable: false })
  nickname: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => Role, { defaultValue: Role.USER, nullable: false })
  role: `${Role}`;

  @Field(() => [PostObject], { nullable: true })
  posts?: Array<Post>;
}
