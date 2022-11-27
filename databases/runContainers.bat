@REM build mysql image
docker build -t vaterite-mysql -f mysql.dockerfile .
docker run --name vaterite_mysql -dp 3306:3306 vaterite-mysql 
@REM build postgres image
docker build -t vaterite-postgres -f postgres.dockerfile .
docker run --name vaterite_postgres -dp 5432:5432 vaterite-postgres 