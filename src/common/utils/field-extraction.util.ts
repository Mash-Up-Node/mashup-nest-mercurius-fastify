// src/common/utils/field-extraction.util.ts
import { FieldNode, Kind } from 'graphql';

/**
 * GraphQL 필드 노드에서 필드 맵을 추출합니다.
 */
export function extractFieldMap(
  fieldNodes: readonly FieldNode[],
): Record<string, any> {
  return fieldNodes.reduce(
    (acc, { selectionSet }) => {
      if (!selectionSet) return acc;

      selectionSet.selections.forEach((selection) => {
        if (selection.kind !== Kind.FIELD) return;

        const fieldName = selection.name.value;

        // 중첩 필드가 있는 경우 재귀적으로 처리
        if (selection.selectionSet) {
          acc[fieldName] = extractNestedFields(selection);
        } else {
          // 단순 필드인 경우
          acc[fieldName] = true;
        }
      });

      return acc;
    },
    {} as Record<string, any>,
  );
}

/**
 * 중첩된 필드를 추출합니다.
 */
export function extractNestedFields(fieldNode: FieldNode): Record<string, any> {
  if (!fieldNode.selectionSet) return {};

  return fieldNode.selectionSet.selections.reduce(
    (acc, selection) => {
      if (selection.kind !== Kind.FIELD) return acc;

      const fieldName = selection.name.value;

      // 중첩 필드가 있는 경우 재귀적으로 처리
      if (selection.selectionSet) {
        acc[fieldName] = extractNestedFields(selection);
      } else {
        // 단순 필드인 경우
        acc[fieldName] = true;
      }

      return acc;
    },
    {} as Record<string, any>,
  );
}

/**
 * 필드 맵에서 필드 이름 리스트를 추출합니다.
 * (기존 FieldAccessInterceptor 호환용)
 */
export function extractFieldNames<T>(
  fieldMap: Record<string, any>,
): (keyof T)[] {
  return Object.keys(fieldMap) as (keyof T)[];
}
