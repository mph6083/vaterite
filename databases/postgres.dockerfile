FROM postgres

ADD initdb.sql /docker-entrypoint-initdb.d

ENV POSTGRES_PASSWORD=password
ENV POSTGRES_USER=postgres

EXPOSE 5432