FROM node:12-alpine

RUN mkdir -p /opt/nodejs/dlq_node_worker

WORKDIR /opt/nodejs/dlq_node_worker/

COPY . /opt/nodejs/dlq_node_worker/

RUN cd /opt/nodejs/dlq_node_worker

RUN npm install
