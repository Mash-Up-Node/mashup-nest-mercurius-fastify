# MASHUP-NEST-MERCURIUS-FASTIFY

## Todo

- [ ] TestCode

- [x] Prisma

- [x] Serverless
- [ ] CI/CD (HyeOn)

  - CI (Husky)
  - CD (Serverless)

- [x] Make the most of `Enhancer`

  - [x] Error handling

    - Manage by code (Idea by Joo, implements by HyeOn)

  - [x] Guard that using passport (YoonHa)

    - [x] Local
    - [x] JWT

- [ ] Custom Decorator

  - [ ] Method decorator for any ideas
  - [ ] Property decorator for any ideas

- [ ] GraphQL

  - [ ] Resolve N+1 Problem in Graphql and Orm (Together)
  - [x] Field-Access (Joo)

## Before start

### Install dependencies

```shell
$  yarn install
```

### Generate prisma

```shell
$ npx prisma generate
```

### Create `.env` file

### (Optional) Create local database

```shell
$  docker-compose up -d
```

### (Optional) Migrate database

```shell
$  yarn migrate:dev
```

### Start server

```shell
$  yarn start:dev
```

## Serverless란?

## GraphQL + mercurius (driver) 사용

## Fastify + AWS lambda

## Serverless to AWS lambda

### download serverless

```shell
$  npm i -g serverless
```

### Set AWS access key into

```shell
$  aws login ...
```

### Build project

```shell
$  yarn build
```

### Pckaging into serverless

```shell
$  npx serverless package
```

### Deploy

```shell
$  npx serverless deploy
```

#### 1. Upload to AWS cloudformation template

#### 2. Deploy to AWS lambda

### Enjoy
