const parser = require('js-sql-parser');
const ast = parser.parse(  
`
select mysql.parse.set 
from mysql.dual,mysql.bob 
JOIN postgres.table ON mysql.dual.CustomerID=postgres.table 
where mysql.dual.id = 4 and mysql.dual.id != 6

`

);

console.log(JSON.stringify(ast, null, 2));
