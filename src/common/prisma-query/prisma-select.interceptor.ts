import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Optional,
} from '@nestjs/common';
import { GqlExecutionContext, GraphQLSchemaHost } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GraphQLResolveInfo, isObjectType } from 'graphql';
import { extractFieldMap } from '../utils/field-extraction.util';

@Injectable()
export class PrismaIncludeInterceptor implements NestInterceptor {
  constructor(
    private readonly schemaHost: GraphQLSchemaHost,
    @Optional() private readonly relationMappings?: Record<string, string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo<GraphQLResolveInfo>();

    // 현재 타입의 이름 추출
    const typeName = info.returnType.toString().replace(/[[\]!]/g, '');

    // 필드 맵 추출
    const fieldMap = extractFieldMap(info.fieldNodes);

    // 스키마에서 관계 필드 매핑 추출
    const relationFields = this.getRelationFields(typeName);

    // Prisma include 객체 생성
    const prismaInclude = this.createPrismaInclude(fieldMap, relationFields);

    // 컨텍스트에 저장
    gqlContext.getContext().prismaInclude = prismaInclude;

    return next.handle();
  }

  /**
   * GraphQL 스키마에서 객체 타입의 관계 필드를 추출합니다.
   */
  private getRelationFields(typeName: string): Record<string, string> {
    const schema = this.schemaHost.schema;
    const typeMap = schema.getTypeMap();
    const objectType = typeMap[typeName];

    // 사용자 정의 매핑이 있으면 우선 사용
    if (this.relationMappings) {
      return this.relationMappings;
    }

    // 기본 매핑: GraphQL 필드명 -> Prisma 필드명 (동일하게 가정)
    const relationFields: Record<string, string> = {};

    if (isObjectType(objectType)) {
      const fields = objectType.getFields();

      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName];
        const fieldType = field.type;
        const unwrappedType = this.unwrapType(fieldType);

        // 객체 타입 필드는 관계 필드로 간주
        if (
          isObjectType(unwrappedType) &&
          unwrappedType.name !== 'Query' &&
          unwrappedType.name !== 'Mutation'
        ) {
          relationFields[fieldName] = fieldName;
        }
      });
    }

    return relationFields;
  }

  /**
   * GraphQL 타입에서 Non-Null 및 List 래퍼를 제거합니다.
   */
  private unwrapType(type: any): any {
    if (type.ofType) {
      return this.unwrapType(type.ofType);
    }
    return type;
  }

  /**
   * 필드 맵과 관계 매핑을 기반으로 Prisma include 객체를 생성합니다.
   */
  private createPrismaInclude(
    fieldMap: Record<string, any>,
    relationMappings: Record<string, string>,
  ): Record<string, any> {
    const include: Record<string, any> = {};

    Object.keys(fieldMap).forEach((field) => {
      const relationField = relationMappings[field];

      if (relationField) {
        // 중첩 필드인 경우 재귀적으로 처리
        if (
          typeof fieldMap[field] === 'object' &&
          Object.keys(fieldMap[field]).length > 0
        ) {
          // 중첩 타입의 관계 필드 매핑 추출
          const nestedTypeName = this.getNestedTypeName(field);
          const nestedRelationFields = this.getRelationFields(nestedTypeName);

          include[relationField] = {
            include: this.createPrismaInclude(
              fieldMap[field],
              nestedRelationFields,
            ),
          };
        } else {
          // 단순 관계 필드
          include[relationField] = true;
        }
      }
    });

    return include;
  }

  /**
   * 중첩 필드의 타입 이름을 추출합니다.
   */
  private getNestedTypeName(fieldName: string): string {
    const schema = this.schemaHost.schema;
    const queryType = schema.getQueryType();

    if (!queryType) return '';

    const fields = queryType.getFields();
    const rootField = fields[fieldName];

    if (!rootField) return '';

    const fieldType = this.unwrapType(rootField.type);
    return fieldType.name;
  }
}
