import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class SignInInput {
  @Field(() => String)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;
}

@InputType()
export class SignUpInput extends SignInInput {
  @Field(() => String)
  @IsNotEmpty()
  nickname: string;
}
