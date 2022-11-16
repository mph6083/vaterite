const sqlParser = require('js-sql-parser');
const parser = require('js-sql-parser');
const ast = parser.parse(
    `
select * , postgres.set.james , rabbit.dfs.asd, "this" , 8
from mysql.dual 
INNER JOIN postgres.bob ON mysql.dual.id = 7
where mysql.dual.id = 7
`

);


var mysql = require('mysql');
var connection = {
    mysql: {
        host: 'localhost',
        user: 'me',
        password: 'secret',
        database: 'my_db'
    },
    postgres: {

    }
}
