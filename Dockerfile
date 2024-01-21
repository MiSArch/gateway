FROM node:21
ENV NODE_ENV production
USER node
WORKDIR /home/node
ADD . .
RUN npm ci
RUN npm run build

FROM node:21
ENV NODE_ENV production
USER node
WORKDIR /home/node
COPY --from=0 /home/node/.mesh ./.mesh
COPY --from=0 /home/node/schemas ./schemas
COPY --from=0 /home/node/node_modules ./node_modules
COPY --from=0 /home/node/package.json ./package.json
COPY --from=0 /home/node/package-lock.json ./package-lock.json
CMD ["npm", "start"]