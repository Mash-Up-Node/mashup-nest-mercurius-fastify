import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCreateInput } from './dto/user-create.input';
import { UserUpdateInput } from './dto/user-update.input';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(include?: Record<string, any>): Promise<User[]> {
    // include 객체가 제공되면 사용하고, 그렇지 않으면 기본값 또는 없음
    return this.prismaService.user.findMany({
      ...(include && Object.keys(include).length > 0 ? { include } : {}),
    });
  }

  async findOneById(
    id: string,
    include?: Record<string, any>,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      ...(include && Object.keys(include).length > 0 ? { include } : {}),
    });
  }

  async createOne(data: UserCreateInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateOne(id: string, data: UserUpdateInput): Promise<User> {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async deleteOneById(id: string): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
