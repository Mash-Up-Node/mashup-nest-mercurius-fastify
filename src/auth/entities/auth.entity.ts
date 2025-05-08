import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { UserObject } from 'src/user/dto/user.object';

@ObjectType()
export class JwtWithUser {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken?: string;

  @Field(() => UserObject)
  user: User;
}
