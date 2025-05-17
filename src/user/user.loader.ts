import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserLoader {
  constructor(private prisma: PrismaService) {}

  userPostsLoader() {
    return {
      async loader(queries) {
        const userIds = queries.map(query => query.obj.id);

        const posts = await this.prisma.post.findMany({
          where: { authorId: { in: userIds } }
        });

        const postsByUserId = {};
        for (const post of posts) {
          if (!postsByUserId[post.authorId]) {
            postsByUserId[post.authorId] = [];
          }
          postsByUserId[post.authorId].push(post);
        }

        return queries.map(query => postsByUserId[query.obj.id] || []);
      }
    };
  }
}
