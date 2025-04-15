import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { LocalAuthGuard } from './strategies/local.strategy';
import { JwtAuthGuard } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.register({}), PrismaModule, ConfigModule, UserModule],
  providers: [AuthService, AuthResolver, LocalAuthGuard, JwtAuthGuard],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
