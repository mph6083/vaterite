import { Capabilities, VateritePlugin } from "vaterite";
import { Parser } from "js-sql-parser"
import {promisify} from "util";
import mysql from "mysql";
export class VateriteMysql implements VateritePlugin{

    constructor(){
        //this.capabilities.add(Capabilities.FILTER);
        //this.capabilities.add(Capabilities.JOIN);
        //this.capabilities.add(Capabilities.PROJECT);
    }
    async execQuery(query: any) {
        const querystring = Parser.stringify(query);
        let con = mysql.createConnection(this.connectionObject);
        const querya = promisify(con.query).bind(con);
        let x = await querya(querystring);
        return x;
    }
    getCapabilities(): Set<Capabilities> {
        return this.capabilities;
    }

    capabilities: Set<Capabilities> = new Set();
    connectionObject: Object = {};


}