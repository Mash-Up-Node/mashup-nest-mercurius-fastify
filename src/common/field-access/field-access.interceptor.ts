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
  SelectionNode,
} from 'graphql';
import { GraphQLContext } from '../config/graphql.context';
import { FIELD_ROLE } from './field-access.decorator';

// 클라이언트가 요청한 필드의 중첩된 구조를 나타내는 타입 정의
type SelectedFields = {
  [key: string]: true | SelectedFields;
};

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

  /**
   * GraphQL 요청의 SelectionNode 배열로부터 선택된 필드들의
   * 중첩된 객체 구조를 재귀적으로 추출하는 함수
   * @param selections 현재 레벨의 GraphQL 쿼리에서 요청한 필드들의 배열
   * @returns 현재 레벨에서 선택된 필드들을 나타내는 중첩 객체
   */
  private extractNestedSelectFields(
    selections: readonly SelectionNode[], // SelectionNode의 읽기 전용 배열을 인자로 받음.
  ): SelectedFields {
    const result: SelectedFields = {};

    // 선택된 노드들을 순회합니다.
    for (const selection of selections) {
      // FieldNode만 처리
      if (selection.kind !== Kind.FIELD) {
        continue;
      }

      // 필드 이름을 가져옵니다.
      const fieldName = selection.name.value;

      // 해당 필드에 중첩된 selectionSet이 있는지 확인합니다.
      if (selection.selectionSet) {
        // selectionSet이 있다면, 이 필드는 중첩된 객체 타입입니다.
        // selectionSet.selections를 인자로 하여 함수를 재귀 호출합니다.
        result[fieldName] = this.extractNestedSelectFields(
          selection.selectionSet.selections,
        );
      } else {
        // selectionSet이 없다면, 이 필드는 리프 필드입니다.
        // `true` 값으로 해당 필드가 선택되었음을 표시합니다.
        result[fieldName] = true;
      }
    }

    return result; // 완성된 현재 레벨의 중첩 객체를 반환합니다.
  }
}
