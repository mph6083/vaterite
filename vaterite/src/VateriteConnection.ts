
import {VateritePlugin} from './VateritePluginInterface';
import {Parser} from "js-sql-parser"
export class VateriteConnection{
    private plugins = new Map<string,VateritePlugin>();
    private constructor(){}

    static async initConnections(connectionObject: Object):Promise<VateriteConnection>{
        const vateriteConnection = new VateriteConnection(); // initalize a vaterite connection
        // loop through the plugins and import them and set the connection object for each plugin.
        for( const db in Object.entries(connectionObject)){
            const dbname = db[0];
            const dbconnectionValue = db[1];

            const plugin:VateritePlugin = await import(`vaterite-${dbname}`);
            plugin.connectionObject = dbconnectionValue;
            vateriteConnection.plugins.set(db,plugin);
        }
        return vateriteConnection;
    }


    execQuery(query:string){
        const queryObject = Parser.parse(query);

        //find tables

    }
    
}


