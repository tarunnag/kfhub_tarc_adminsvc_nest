FROM node:10-alpine
ENV KF_SECURE_ENV_SECRET_PASSWORD=dev123
RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm config set //registry.npmjs.org/:_authToken 4338ec22-124f-4eab-9597-18f16eb38c3d
RUN npm install
COPY --chown=node:node release/ .
EXPOSE 3000
CMD [ "node", "main.js" ]
