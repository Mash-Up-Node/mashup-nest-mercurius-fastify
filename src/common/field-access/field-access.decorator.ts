import 'reflect-metadata';
import { User } from '@prisma/client';

export const FIELD_ROLE = Symbol('FIELD_ROLE');

export const FieldAccess = (...roles: User['role'][]): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    if (!roles.length) roles = ['USER'];
    Reflect.defineMetadata(FIELD_ROLE, roles, target, propertyKey);
  };
};
