FROM node:16-alpine as builder
WORKDIR /syfomodiaperson

COPY server.ts package.json tsconfig.json ./
COPY server ./server
COPY node_modules ./node_modules
COPY img ./img
COPY dist ./dist

RUN npm install -g typescript @types/node
RUN tsc --build

FROM gcr.io/distroless/nodejs16-debian11
WORKDIR /syfomodiaperson

COPY --from=builder /syfomodiaperson/package.json ./
COPY --from=builder /syfomodiaperson/dist/server.js ./
COPY --from=builder /syfomodiaperson/dist/server.js.map ./
COPY --from=builder /syfomodiaperson/dist/server ./server
COPY --from=builder /syfomodiaperson/dist/index.html ./dist/index.html
COPY --from=builder /syfomodiaperson/dist/main.bundle.js ./dist/main.bundle.js
COPY --from=builder /syfomodiaperson/node_modules ./node_modules
COPY --from=builder /syfomodiaperson/img ./img

EXPOSE 8080
USER nonroot
CMD ["./server.js"]
