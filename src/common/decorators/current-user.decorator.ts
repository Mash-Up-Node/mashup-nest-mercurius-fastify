import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../config/graphql.context';

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);
    const { user } = gqlContext.getContext<GraphQLContext>();

    return user;
  },
);
