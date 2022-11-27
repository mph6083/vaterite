const { Client } = require('pg')


users = 1000
reviews = 8


async function pgInit() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'password',
        port: 5432,
    });
    await client.connect();
    for (let i = 0; i < users; i++) {
        await client.query(`insert into USERS values ('user${i}','pass')`);

        for (let j = 0; j < reviews; i++) {
            await client.query(`insert into REVIEWS values (${j},'user${i}','product was amazing',5)`)
        }
    }
    await client.end();
}
async function pgWipe(){
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'password',
        port: 5432,
    });
    await client.connect();

    await client.query(`delete from USERS`);
    await client.query(`delete from Products`);

    await client.end();
}


//mysqlInit():



pgInit();
