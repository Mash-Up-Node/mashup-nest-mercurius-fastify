import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignInInput, SignUpInput } from './inputs/auth.input';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(input: SignInInput) {
    const { email, password } = input;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }

    const passOk: boolean = await bcrypt.compare(password, user.password);
    if (!passOk) {
      return null;
    }
    return user;
  }

  async signUp(input: SignUpInput) {
    const { email, password, nickname } = input;
    const hashedPassword = await this.hashPassword(password);
    const user = await this.prismaService.user.create({
      data: {
        email,
        nickname,
        password: hashedPassword,
      },
    });
    const accessToken = await this.issueToken(user, false);
    const refreshToken = await this.issueToken(user, true);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async signIn(input: SignInInput) {
    const { email, password } = input;
    const user = await this.authenticate({ email, password });
    if (!user) {
      throw new UnauthorizedException('잘못된 로그인 정보입니다!');
    }
    const accessToken = await this.issueToken(user, false);
    const refreshToken = await this.issueToken(user, true);
    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
  async issueToken(user: User, isRefreshToken: boolean) {
    const secret = this.configService
      .get<string>(
        isRefreshToken ? 'REFRESH_TOKEN_SECRET' : 'ACCESS_TOKEN_SECRET',
      )
      ?.replace(/\\n/g, '\n');
    return this.jwtService.signAsync(
      {
        sub: user.id,
        role: user.role,
        type: isRefreshToken ? 'refresh' : 'access',
      },
      {
        secret,
        expiresIn: isRefreshToken ? '7d' : '15m',
      },
    );
  }
}
