# MASHUP-NEST-MERCURIUS-FASTIFY

## Todo

- [ ] TestCode
- [ ] Generator (Handlebar template)
- [ ] Prisma
- [ ] Auth

  - [ ] Passport related Guard

- [x] Serverless
- [ ] CI/CD
- [ ] Error handling
- [ ] Caching

- [ ] Custom Decorator
- [ ] Make the most of `Enhancer`
- [ ] GraphQL
- [ ] Resolve N+1 Problem in graphql and orm

- [ ] Docker ?

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
