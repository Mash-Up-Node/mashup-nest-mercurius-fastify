import { HttpStatus } from '@nestjs/common';
import { createException } from './exception.factory';

const CustomException = createException();

export class UserNotFoundException extends CustomException(
  HttpStatus.NOT_FOUND,
  '{{name}} 유저를 찾을 수 없습니다.',
  'NOT_FOUND',
) {}
