import { ExecutionResult, GraphQLFormattedError } from 'graphql';
import { MercuriusContext } from 'mercurius';
import { HttpException, HttpStatus } from '@nestjs/common';

export const errorFormatter = (
  execution: ExecutionResult & Required<Pick<ExecutionResult, 'errors'>>,
  context: MercuriusContext,
) => {
  let statusCode = HttpStatus.OK;

  const formattedError = execution.errors.map((error) => {
    context.reply.log.error({ err: error }, error.message);
    const { originalError } = error;

    const isFastifyError = originalError?.name === 'FastifyError';

    if (isFastifyError) {
      statusCode = HttpStatus.BAD_REQUEST;
    }

    /**
     * @Todo
     * CustomException 만들어서, 나머지 500 처리
     */
    if (originalError instanceof HttpException) {
      const errorStatus = originalError.getStatus();
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
