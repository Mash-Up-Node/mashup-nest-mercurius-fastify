import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';

export interface GraphQLContext {
  req: FastifyRequest;
  reply: FastifyReply;
  user?: User;
}

export const graphQLContext = (
  req: FastifyRequest,
  reply: FastifyReply,
): GraphQLContext => {
  return {
    req,
    reply,
    /**
     * @todo
     * Guard에서 주입받도록
     */
    user: {
      role: 'USER',
    } as User,
  };
};
