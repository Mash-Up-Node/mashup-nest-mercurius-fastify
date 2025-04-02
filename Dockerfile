FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install -production
RUN yarn add @nestjs/cli

COPY . .

RUN npx prisma generate

RUN yarn build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

ENV NODE_ENV=production

EXPOSE 8000

CMD [ "node", "dist/main.js" ]
