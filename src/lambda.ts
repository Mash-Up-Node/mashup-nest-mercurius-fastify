import awsLambdaFastify, {
  LambdaResponse,
  PromiseHandler,
} from '@fastify/aws-lambda';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { bootstrapServer, NestApp } from './main';

let cachedApp: NestApp;
let cachedProxy: PromiseHandler<APIGatewayProxyEvent, LambdaResponse>;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!cachedApp) {
    cachedApp = await bootstrapServer();
  }

  if (!cachedProxy) {
    cachedProxy = awsLambdaFastify(cachedApp.instance, {
      decorateRequest: true,
    });
    await cachedApp.instance.ready();
  }
  return cachedProxy(event, context);
};
