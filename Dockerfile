FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app

ARG VITE_API_URL
ARG VITE_ADMIN_API_KEY
ARG VITE_ADMIN_SESSION_NAME
ARG VITE_ADMIN_SESSION_KEY
ARG VITE_ADMIN_TOKEN_NAME
ARG VITE_ADMIN_TOKEN_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ADMIN_API_KEY=$VITE_ADMIN_API_KEY
ENV VITE_ADMIN_SESSION_NAME=$VITE_ADMIN_SESSION_NAME
ENV VITE_ADMIN_SESSION_KEY=$VITE_ADMIN_SESSION_KEY
ENV VITE_ADMIN_TOKEN_NAME=$VITE_ADMIN_TOKEN_NAME
ENV VITE_ADMIN_TOKEN_KEY=$VITE_ADMIN_TOKEN_KEY

RUN npm run build

FROM node:20-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app

EXPOSE 5173
ENV PORT=5173

CMD ["npm", "run", "start"]