import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma, Role } from '@prisma/client';

@InputType()
export class UserUpdateInput implements Prisma.UserUpdateInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  nickname?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}
