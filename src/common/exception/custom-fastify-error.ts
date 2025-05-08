import { HttpStatus } from '@nestjs/common';
import { FastifyError } from 'fastify';

export class CustomFastifyError extends Error implements FastifyError {
  code: string;
  statusCode: HttpStatus;

  constructor({
    message,
    code = 'FASTIFY_ERROR',
    statusCode = HttpStatus.BAD_REQUEST,
  }: Error & { code?: string; statusCode?: HttpStatus }) {
    super(message);
    this.name = 'CustomFastifyError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
