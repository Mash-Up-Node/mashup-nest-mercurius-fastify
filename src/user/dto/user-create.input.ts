import { Field, ID, InputType } from '@nestjs/graphql';
import { Prisma, Role } from '@prisma/client';

@InputType()
export class UserCreateInput implements Prisma.UserCreateInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String)
  email: string;

  @Field(() => String)
  nickname: string;

  @Field(() => String)
  password: string;

  @Field(() => Role, { nullable: true, defaultValue: Role.USER })
  role?: Role;
}
