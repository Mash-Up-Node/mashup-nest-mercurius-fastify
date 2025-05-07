import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext, TypeMetadataStorage } from '@nestjs/graphql';
import { Observable, map } from 'rxjs';

import { Role, User } from '@prisma/client';
import {
  FieldNode,
  getNamedType,
  GraphQLResolveInfo,
  GraphQLType,
  Kind,
} from 'graphql';
import { GraphQLContext } from '../config/graphql.context';
import { FIELD_ROLE } from './field-access.decorator';

@Injectable()
export class FieldAccessInterceptor<T extends Record<string, unknown>>
  implements NestInterceptor
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const gqlContext = GqlExecutionContext.create(context);

    const { returnType, fieldNodes } = gqlContext.getInfo<GraphQLResolveInfo>();

    const targetClass = this.extractTargetClass(returnType);

    if (!targetClass) return next.handle();

    const { user } = gqlContext.getContext<GraphQLContext>();

    const selectField = this.extractSelectFields<T>([...fieldNodes]);

    return next.handle().pipe(
      map((data: T | T[]) => {
        if (Array.isArray(data)) {
          return data.map((v) =>
            this.filterField(v, targetClass, selectField, user?.role),
          );
        }

        return this.filterField(data, targetClass, selectField, user?.role);
      }),
    );
  }

  private filterField<T extends Record<string, unknown>>(
    obj: T,
    targetClass: { prototype: object },
    selectField: (keyof T)[],
    userRole?: User['role'],
  ) {
    if (!obj || typeof obj !== 'object') return obj;

    return Object.keys(obj)
      .filter((k) => selectField.includes(k))
      .reduce((acc, cur: keyof T) => {
        const requiredRoles = Reflect.getMetadata(
          FIELD_ROLE,
          targetClass.prototype,
          cur as string,
        ) as User['role'][] | undefined;

        const isPermitted = this.hasAccess(requiredRoles, userRole);

        if (!isPermitted) throw new ForbiddenException();

        acc[cur] = obj[cur];

        return acc;
      }, {} as T);
  }

  private hasAccess<T extends User['role']>(
    requiredRole: T[] | undefined,
    userRole?: T,
  ) {
    if (userRole === Role.ADMIN) return true;

    return requiredRole?.some((role) => role === userRole) ?? true;
  }

  private extractSelectFields<T>(fieldNodes: FieldNode[]): (keyof T)[] {
    return fieldNodes.reduce(
      (acc, { selectionSet }) => {
        if (!selectionSet) return acc;

        selectionSet.selections.forEach((selection) => {
          if (selection.kind !== Kind.FIELD) return;

          acc.push(selection.name.value as keyof T);
        });

        return acc;
      },
      [] as (keyof T)[],
    );
  }

  private extractTargetClass(returnType: GraphQLType) {
    const gqlType = getNamedType(returnType);

    const typeName = gqlType.name;

    const typeMetadata = TypeMetadataStorage.getObjectTypesMetadata().find(
      (metadata) => metadata.name === typeName,
    );

    return typeMetadata?.target as { prototype: object };
  }
}
