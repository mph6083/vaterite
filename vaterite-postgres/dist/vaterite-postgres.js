"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VateritePostgres = void 0;
const js_sql_parser_1 = require("js-sql-parser");
const pg_1 = require("pg");
class VateritePostgres {
    constructor() {
        this.capabilities = new Set();
        this.connectionObject = {};
        //this.capabilities.add(Capabilities.FILTER);
        //this.capabilities.add(Capabilities.JOIN);
        //this.capabilities.add(Capabilities.PROJECT);
    }
    async execQuery(query) {
        const querystring = js_sql_parser_1.Parser.stringify(query);
        const client = new pg_1.Client(this.connectionObject);
        await client.connect();
        let response = await client.query(querystring);
        await client.end();
        return response;
    }
    getCapabilities() {
        return this.capabilities;
    }
}
exports.VateritePostgres = VateritePostgres;
