import { Capabilities, VateritePlugin } from "vaterite";
import { Parser } from "js-sql-parser"
import { Pool, Client } from "pg";
export class VateritePostgres implements VateritePlugin{

    constructor(){
        //this.capabilities.add(Capabilities.FILTER);
        //this.capabilities.add(Capabilities.JOIN);
        //this.capabilities.add(Capabilities.PROJECT);
    }
    async execQuery(query: any) {
        const querystring = Parser.stringify(query);
        const client = new Client(this.connectionObject);
        await client.connect();
        let response = await client.query(querystring);
        await client.end()
        return response;
    }
    getCapabilities(): Set<Capabilities> {
        return this.capabilities;
    }

    capabilities: Set<Capabilities> = new Set();
    connectionObject: Object = {};


}