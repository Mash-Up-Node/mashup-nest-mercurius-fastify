import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../@generated/user/user.model';

@ObjectType()
export class JwtWithUser {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken?: string;

  @Field(() => User)
  user: User;
}
