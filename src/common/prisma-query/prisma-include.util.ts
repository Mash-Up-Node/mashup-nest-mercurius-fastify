// src/common/prisma-query/prisma-include.util.ts

import { GraphQLResolveInfo } from 'graphql';
import { extractFieldMap } from '../utils/field-extraction.util';

/**
 * 필드 맵을 Prisma include 객체로 변환합니다.
 */
export function createPrismaInclude(
  fieldMap: Record<string, any>,
  relationMappings: Record<string, string> = {},
): Record<string, any> {
  const include: Record<string, any> = {};

  // 각 필드에 대해 관계 필드인지 확인하고 include 객체 설정
  Object.keys(fieldMap).forEach((field) => {
    const relationField = relationMappings[field] || field;

    if (relationField in relationMappings || relationMappings[field]) {
      // 중첩 관계 필드가 있는 경우 재귀적으로 include 객체 생성
      if (typeof fieldMap[field] === 'object' && fieldMap[field] !== true) {
        include[relationField] = {
          include: createPrismaInclude(fieldMap[field], relationMappings),
        };
      } else {
        // 단순 관계 필드인 경우
        include[relationField] = true;
      }
    }
  });

  return include;
}

/**
 * GraphQL 정보에서 Prisma include 객체를 생성합니다.
 */
export function createPrismaIncludeFromInfo(
  info: GraphQLResolveInfo,
  relationMappings: Record<string, string> = {},
): Record<string, any> {
  const fieldMap = extractFieldMap(info.fieldNodes);
  return createPrismaInclude(fieldMap, relationMappings);
}
