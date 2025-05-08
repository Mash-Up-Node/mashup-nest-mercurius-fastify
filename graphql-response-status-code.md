# GraphQL-Respons-Status-Code

- [HTTP Status](#http-status)
  - [✅ Status code with 200 OK](#status-code-with-200-ok)
    - [요청 성공](#✅-요청-성공)
    - [요청 부분 성공](#⚠️-요청-부분-성공-일부-데이터--일부-에러)
    - [데이터 없음 (ex: NotFoundErrorException)](#⚠️-데이터-없음-ex-notfounderrorexception)
  - [❌ Status code without 200 OK](#status-code-without-200-ok)
    - [요청 오류 (JSON 파싱, 문법 오류 등)](#❌-요청-오류-json-파싱-오류-및-문법-오류-등)
    - [인증/인가 실패](#❌-인증인가-실패)
    - [Accept 타입 오류](#❌-클라이언트-accept-타입-오류)
    - [서버 내부 문제](#❌-서버-내부-문제)
- [총정리](#총정리)
- [참고자료](#참고자료)

## HTTP Status

기본적으로 HTTP Status Code 의 기본 동작을 따라간다.

### Status code with 200 OK

#### ✅ 요청 성공

- **HTTP Status Code**: `200 OK`
- **Data**: `!== null`
- **Errors**: `N/A`

#### ⚠️ 요청 부분 성공 (일부 데이터 + 일부 에러)

- **HTTP Status Code**: `200 OK`
- **Data**: `!== null`
- **Errors**: `Array<GraphQLError>` (`.length >= 1`)

#### ⚠️ 데이터 없음 (ex: NotFoundErrorException)

GraphQL의 응답에 에러를 포함할 경우, [GraphQL Over HTTP
Specification](https://github.com/graphql/graphql-over-http/blob/main/spec/GraphQLOverHTTP.md#applicationjson)에 설명된 바와 같이 HTTP Status Code 는 `200 OK` 이다.

- **HTTP Status Code**: `200 OK`
- **Data**: `null`
- **Errors**: `Array<GraphQLError>` (`.length >= 1`)

#### Status Code without 200 OK

#### ❌ 요청 오류 (JSON 파싱 오류 및 문법 오류 등)

GraphQL 요청 자체가 잘못된 경우

- **HTTP Status Code**: `400 Bad Request`
- **Data**: `null`
- **Errors**: `Array<GraphQLError>` (`.length === 1`)

#### ❌ 인증/인가 실패

인증 필요, 권한 없음 등

- **HTTP Status Code**: `401 Unauthorized`, `403 Forbidden`
- **Data**: `null`
- **Errors**: `Array<GraphQLError>` (`.length === 1`)

#### ❌ 클라이언트 Accept 타입 오류

Request의 Header `Accept` 에 `application/graphql-response+json` 이 존재하지 않을 경우

대부분의 GraphQL 에러는 `errorFormatter`를 통해 응답 포맷을 커스터마이징하지만,  
`406 Not Acceptable` 과 같이 HTTP 레벨에서 차단해야 하는 에러는  
Fastify의 `onRequest` hook을 통해 사전에 처리한다.

- **HTTP Status Code**: `406 Not Acceptable`
- **Data**: `null`
- **Errors**: `Array<GraphQLError>` (`.length === 1`)

#### ❌ 서버 내부 문제

서버 실행 중 에러, 예외 등

- **HTTP Status Code**: `500 Internal Server Error`
- **Data**: `null`
- **Errors**: `Array<GraphQLError>` (`.length === 1`)

### 총정리

| 상황                        | HTTP Status | Data | Errors |
| --------------------------- | ----------- | ---- | ------ |
| 요청 성공                   | 200         | ✅   | ❌     |
| 부분 성공                   | 200         | ✅   | ✅     |
| 데이터 없음                 | 200         | ❌   | ✅     |
| 요청실패(파싱,문법 에러 등) | 400         | ❌   | ✅     |
| 인증 실패                   | 401 / 403   | ❌   | ✅     |
| Accept 미지원               | 406         | ❌   | ✅     |
| 서버 내부 오류              | 500         | ❌   | ✅     |

### 참고자료

이 에러 처리 형식은 [graphql-over-http](https://graphql.github.io/graphql-over-http/draft/)에서 정의한대로 따르고 있으며, 아직 초안이기에 추후 팔로업하며 맞출 예정

- [https://graphql.org/learn/serving-over-http/#status-codes](https://graphql.org/learn/serving-over-http/#status-codes)
- [https://github.com/graphql/graphql-over-http/blob/main/spec/GraphQLOverHTTP.md](https://github.com/graphql/graphql-over-http/blob/main/spec/GraphQLOverHTTP.md)
- [https://graphql.github.io/graphql-over-http/draft/](https://graphql.github.io/graphql-over-http/draft/)
