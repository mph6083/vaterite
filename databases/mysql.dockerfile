FROM mysql

ADD /initdb.sql /docker-entrypoint-initdb.d
ENV MYSQL_ROOT_PASSWORD password
ENV MYSQL_DATABASE db

EXPOSE 3306