import { ExecutionResult, GraphQLError, GraphQLFormattedError } from 'graphql';
import { MercuriusContext } from 'mercurius';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomFastifyError } from './custom-fastify-error';
import { BaseException } from './exception.factory';

export const errorFormatter = (
  execution: ExecutionResult & Required<Pick<ExecutionResult, 'errors'>>,
  context: MercuriusContext,
) => {
  let statusCode = HttpStatus.OK;

  const formattedError = execution.errors.map((error) =>
    formatError(error, {
      setHttpStatus: (v) => (statusCode = v),
      logError: () => context.reply.log.error({ err: error }, error.message),
      captureUnexpectedException: () => {
        /**
         * @Todo
         * Do sentry like
         */
      },
    }),
  );

  return {
    statusCode,
    response: {
      data: statusCode === HttpStatus.OK ? execution.data : null,
      errors: formattedError,
    },
  };
};

const determineHttpStatus = (
  error: Error | undefined,
  errorStatus: HttpStatus,
) => {
  const isFastifyError = error?.name === 'FastifyError';

  if (isFastifyError) {
    return HttpStatus.BAD_REQUEST;
  }

  if (error instanceof HttpException) {
    const originalStatus = error.getStatus();
    if (
      [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN].includes(originalStatus)
    ) {
      return originalStatus;
    }
  }

  if (errorStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  return HttpStatus.OK;
};

const isBaseException = (
  error: unknown,
): error is BaseException<number, string, string> => {
  return error instanceof BaseException;
};

const determineErrorCondition = (error: Error | undefined) => {
  const isFastifyError = error?.name === 'FastifyError';

  let errorStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  let errorCode = 'INTERNAL_SERVER_ERROR';

  if (isFastifyError) {
    const customFastifyError = new CustomFastifyError(error);
    errorCode = customFastifyError.code;
    errorStatus = customFastifyError.statusCode;
  }

  if (isBaseException(error)) {
    errorStatus = error.statusCode;
    errorCode = error.code;
  }

  return { errorStatus, errorCode };
};

interface FormatErrorOption {
  setHttpStatus: (v: HttpStatus) => void;
  logError: () => void;
  captureUnexpectedException: () => void;
}

const formatError = (
  error: GraphQLError,
  { setHttpStatus, logError, captureUnexpectedException }: FormatErrorOption,
) => {
  void logError();

  const { originalError } = error;

  const { errorStatus, errorCode } = determineErrorCondition(originalError);

  const httpStatus = determineHttpStatus(originalError, errorStatus);

  void setHttpStatus(httpStatus);

  if (errorStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
    void captureUnexpectedException();
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
};
