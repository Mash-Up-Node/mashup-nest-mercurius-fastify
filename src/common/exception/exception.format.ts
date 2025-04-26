import { ExecutionResult, GraphQLFormattedError } from 'graphql';
import { MercuriusContext } from 'mercurius';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomFastifyError } from './custom-fastify-error';
import { BaseException } from './exception.factory';

function isBaseException(
  error: unknown,
): error is BaseException<number, string, string> {
  return error instanceof BaseException;
}

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

    if (isBaseException(originalError)) {
      errorStatus = originalError.statusCode;
      errorCode = originalError.code;
    }

    if (originalError instanceof HttpException) {
      const originalStatus = originalError.getStatus();
      if (
        [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN].includes(originalStatus)
      ) {
        statusCode = originalStatus;
      }
    }

    if (errorStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      /**
       * @Todo
       * Do sentry like
       */
    }

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
