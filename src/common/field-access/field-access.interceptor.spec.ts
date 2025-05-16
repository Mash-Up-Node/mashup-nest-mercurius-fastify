import { FieldAccessInterceptor } from './field-access.interceptor';
import { Kind, SelectionNode } from 'graphql';

type SelectedFields = {
  [key: string]: true | SelectedFields;
};

describe('FieldAccessInterceptor (extractNestedSelectFields)', () => {
  // 메서드 하나만 테스트 하기 때문에 any로 설정
  let interceptor: FieldAccessInterceptor<any>;

  beforeEach(() => {
    interceptor = new FieldAccessInterceptor();
  });

  it('should correctly extract the structure for users with nested posts', () => {
    const inputSelections: readonly SelectionNode[] = [
      {
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: 'users' },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'id' },
            },
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'nickname' },
            },
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: 'posts' },
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  {
                    kind: Kind.FIELD,
                    name: { kind: Kind.NAME, value: 'id' },
                  },
                  {
                    kind: Kind.FIELD,
                    name: { kind: Kind.NAME, value: 'title' },
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    const expectedStructure: SelectedFields = {
      users: {
        id: true,
        nickname: true,
        posts: {
          id: true,
          title: true,
        },
      },
    };

    // private 메서드를 클래스 외부에서 직접 호출하기 위해 any로 캐스팅
    const actualStructure = (interceptor as any).extractNestedSelectFields(inputSelections);

    expect(actualStructure).toEqual(expectedStructure);
  });
});
