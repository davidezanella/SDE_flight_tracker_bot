FROM node:8.16.2-alpine

ADD . /

RUN npm install

EXPOSE 80

ENV PGUSER=root
ENV PGHOST=user_db
ENV PGPASSWORD=root
ENV PGDATABASE=users
ENV PGPORT=5432

CMD ["npm", "start"]

