FROM node:12-alpine

RUN mkdir -p /opt/nodejs/process_dlq_node_worker

WORKDIR /opt/nodejs/process_dlq_node_worker/

COPY . /opt/nodejs/process_dlq_node_worker/

RUN cd /opt/nodejs/process_dlq_node_worker

RUN npm install

RUN npm test

CMD [ "node", "app.js" ]