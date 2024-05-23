FROM node:21
ENV NODE_ENV production
USER node
WORKDIR /home/node
RUN curl -sSL https://rover.apollo.dev/nix/v0.23.0 | sh
ADD . .
RUN /home/node/.rover/bin/rover supergraph compose --config ./supergraph.yaml --output ./supergraph.graphql --elv2-license accept
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
COPY --from=0 /home/node/supergraph.yaml ./supergraph.yaml
COPY --from=0 /home/node/supergraph.graphql ./supergraph.graphql
COPY --from=0 /home/node/envelopPlugins.ts ./envelopPlugins.ts
CMD ["npm", "start"]