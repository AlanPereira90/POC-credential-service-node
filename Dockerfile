FROM node:16.13

ARG PORT=6060
EXPOSE $PORT
ARG SRV_DIR="/api"
WORKDIR $SRV_DIR

RUN apt-get update && apt-get install -y telnet net-tools dnsutils curl jq joe
RUN groupadd -g 2000 appuser && useradd -r -u 2000 -g appuser appuser
RUN mkdir -p /home/appuser/.config && chown -R appuser:appuser /home/appuser
RUN chown -R appuser:appuser $SRV_DIR

COPY package.json package-lock.json tsconfig.json tsconfig.build.json nodemon.json ./

RUN npm ci && npm cache clean --force

ARG PORT_DEBUGGER=9229
EXPOSE $PORT_DEBUGGER

COPY ./src ./src

ENV NODE_ENV development

CMD ["npm", "run", "dev"]