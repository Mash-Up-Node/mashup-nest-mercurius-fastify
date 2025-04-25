import { ExecutionResult, GraphQLFormattedError } from 'graphql';
import { MercuriusContext } from 'mercurius';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomFastifyError } from './custom-fastify-error';

export const errorFormatter = (
  execution: ExecutionResult & Required<Pick<ExecutionResult, 'errors'>>,
  context: MercuriusContext,
) => {
  let statusCode = HttpStatus.OK;

  const formattedError = execution.errors.map((error) => {
    context.reply.log.error({ err: error }, error.message);
    const { originalError } = error;

    let errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';

    const isFastifyError = originalError?.name === 'FastifyError';

    if (isFastifyError) {
      statusCode = HttpStatus.BAD_REQUEST;
      const customFastifyError = new CustomFastifyError(originalError);
      errorCode = customFastifyError.code;
      errorStatus = customFastifyError.statusCode;
    }

    /**
     * @Todo
     * CustomException 만들어서, 나머지 500 처리
     */
    if (originalError instanceof HttpException) {
      errorStatus = originalError.getStatus();

      if (
        [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN].includes(errorStatus)
      ) {
        statusCode = errorStatus;
      }
    }

    /**
     * @Todo
     * 500 일 때 if 문으로 sentry 전송같은 거?
     */

    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
      extensions: {
        errorStatus,
        errorCode,
        ...error.extensions,
      },
    } satisfies GraphQLFormattedError;
  });

  return {
    statusCode,
    response: {
      data: statusCode === HttpStatus.OK ? execution.data : null,
      errors: formattedError,
    },
  };
};
