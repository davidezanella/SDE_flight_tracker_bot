FROM node:8.16.2-alpine

ENV KEY=key
ENV SECRET=secret

ADD . /

RUN npm install

EXPOSE 80

CMD ["npm", "start"]

