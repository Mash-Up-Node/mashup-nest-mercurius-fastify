import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { UserUpdateInput } from 'src/@generated/user/user-update.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prismaService.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
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
