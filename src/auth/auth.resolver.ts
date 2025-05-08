import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput } from './inputs/auth.input';
import { JwtWithUser } from './entities/auth.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => JwtWithUser)
  signIn(@Args('data') data: SignInInput) {
    return this.authService.signIn(data);
  }

  @Mutation(() => JwtWithUser)
  signUp(@Args('data') data: SignUpInput) {
    return this.authService.signUp(data);
  }
}
