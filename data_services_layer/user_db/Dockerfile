FROM postgres:12-alpine

COPY ./init.sql /docker-entrypoint-initdb.d/init.sql

ENV POSTGRES_PASSWORD=root
ENV POSTGRES_USER=root
ENV POSTGRES_DB=users
ENV PGDATA=/tmp

EXPOSE 5432
