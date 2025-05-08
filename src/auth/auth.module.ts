import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { LocalAuthGuard, LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard, JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({}), PrismaModule, ConfigModule, UserModule],
  providers: [
    AuthService,
    AuthResolver,
    LocalAuthGuard,
    JwtAuthGuard,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
