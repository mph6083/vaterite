
import { Capabilities, VateritePlugin } from './VateritePluginInterface';
import { Parser, SQLquery, SQLResponse } from "js-sql-parser"
export class VateriteConnection {
    private plugins = new Map<string, VateritePlugin>();
    private constructor() { }

    static async initConnections(connectionObject: Object): Promise<VateriteConnection> {
        const vateriteConnection = new VateriteConnection(); // initalize a vaterite connection
        // loop through the plugins and import them and set the connection object for each plugin.
        for (const db in Object.entries(connectionObject)) {
            const dbname = db[0];
            const dbconnectionValue = db[1];

            const plugin: VateritePlugin = await import(`vaterite-${dbname}`);
            plugin.connectionObject = dbconnectionValue;
            vateriteConnection.plugins.set(db, plugin);
        }
        return vateriteConnection;
    }


    async execQuery(query: string) {

        const queries = new Map<string, SQLResponse>()

        const queryObject: SQLResponse = Parser.parse(query);

        this.createQueryObjects(queries, queryObject)
        this.optimizeQueries(queries, queryObject)

        const pluginResponses: Map<string, Array<any>> = await this.getPluginResponses(queries);

        return this.JsExecutor(pluginResponses, queries.get("js")!);

        //find tables

    }

    async JsExecutor(pluginResponses: Map<string, Array<any>>, jsInstructions: SQLResponse) {
        //
        const processedpluginResponses: Map<string, Array<any>> = this.preProcessResponses(pluginResponses);
        //join
        let rows: Array<any> = this.JsJoin(processedpluginResponses, jsInstructions.value.from)
        //where
        rows = this.jsWhere(rows, jsInstructions.value.where)
        // select
        rows = this.jsSelect(rows, jsInstructions.value.selectItems);
    }

    preProcessResponses(pluginResponses: Map<string, Array<any>>): Map<string, Array<any>> {
        const newResponses = new Map<string, Array<any>>()
        for (let [key, value] of pluginResponses) {
            let newValue = value.map((val) => {
                let newVal: any = {};
                for (let object in Object.entries(val)) {
                    let newkey = key + "." + object[0]
                    newVal[newkey] = object[1];
                }
                return newVal;
            })
            newResponses.set(key, newValue)
        }
        return newResponses;
    }


    JsJoin(pluginResponses: Map<string, Array<any>>, from: any): any[] {
        // god awful n^2 for all joins
        let returnArray = [];
        for (let [key, value] of pluginResponses) {
            if (returnArray.length == 0) {
                returnArray = value;
                continue;
            }
            let newReturnArray = [];
            for (let olditem of returnArray) {
                for (let newitem of value) {
                    newReturnArray.push({ ...olditem, ...newitem });
                }
            }
            returnArray = newReturnArray;
        }
        returnArray = this.jsWhere(returnArray, from.value[0].value.condition.value);
        return returnArray;
    }

    jsWhere(rows: any[], where: any): any[] {
        // this is awful and brilliant
        return rows.filter((obj) => {
            let left = where.left.type == "Identifier" ? `obj[${where.left.value}]` : where.left.value;
            let right = where.right.type == "Identifier" ? `obj[${where.right.value}]` : where.right.value;
            let stringcond = `${left} ${where.operator} ${right}`;
            return eval(stringcond);
        })
    }

    jsSelect(rows: any[], selectItems: any): any[] {
        return rows.map((row) => {
            let returnObj: any = {};
            for(let selector of selectItems.value ){
                returnObj[selector.value] = row[selector.value];
            }
        })
    }

    async getPluginResponses(queries: Map<string, SQLResponse>): Promise<Map<string, Array<any>>> {
        const retMap = new Map<string, Array<any>>();
        for (let [key, value] of queries) {
            if (key != "js") {
                retMap.set(key, await this.plugins.get(key)?.execQuery(value));
            }
        }
        return retMap
    }

    optimizeQueries(queries: Map<string, SQLResponse>, queryObject: SQLResponse) {
        //parse query
        this.handleSelect(queries, queryObject.value.selectItems);
        this.handleWhere(queries, queryObject.value.where);
        if (queryObject.value.from.value?.value?.type && queryObject.value.from.value?.value?.type == "TableFactor") {
            this.handleFrom(queries, queryObject.value.from);
        }
        else {
            this.handleJoin(queries, queryObject.value.from);
        }
    }


    createQueryObjects(queries: Map<string, SQLResponse>, queryObject: SQLResponse) {

        const SQLqueryBlank: SQLquery = {
            ...queryObject.value,
            selectItems: { ...queryObject.value.selectItems, value: [] },
            from: undefined,
            where: undefined
        };

        // create a sqlQuery for each plugin in the intance
        for (let plugin of this.plugins.keys()) {
            let queryResponse: SQLResponse = {
                ...queryObject,
                value: { ...SQLqueryBlank }
            }
            queries.set(plugin, queryResponse);
        }
        //add javasctipt
        let queryResponse: SQLResponse = {
            ...queryObject,
            value: { ...SQLqueryBlank }
        }
        queries.set("js", queryResponse);

    }

    handleSelect(queries: Map<string, SQLResponse>, select: any) {
        for (let selectIdentifier of select.value) {
            if (selectIdentifier.type == "Identifier") {
                if (selectIdentifier.value.split(".").length == 0) {
                    queries.get('js')?.value.selectItems.push({ ...selectIdentifier });
                }
                else {
                    if (this.plugins.get(selectIdentifier.value.split(".")[0])?.getCapabilities().has(Capabilities.PROJECT)) {
                        queries.get(selectIdentifier.value.split(".")[0])?.value.selectItems.push({ ...selectIdentifier });
                    }
                    queries.get('js')?.value.selectItems.push({ ...selectIdentifier });
                }
            }
            else {
                queries.get('js')?.value.selectItems.push({ ...selectIdentifier });
            }
        }
    }
    handleWhere(queries: Map<string, SQLResponse>, where: any) {
        //to be able to extend it to the specific level
        let curretLevel: any = where;

        if (curretLevel.left && curretLevel.right) {
            if (curretLevel.left.type == "Identifier") {
                if (curretLevel.right.type == "Identifier") {
                    if (curretLevel.left.value.split(".")[0] == curretLevel.right.value.split(".")[0]) {
                        if (this.plugins.get(curretLevel.left.value.split(".")[0])?.getCapabilities().has(Capabilities.FILTER)) {

                        }
                        else {
                            queries.get(curretLevel.left.value.split(".")[0])!.value.where = { ...where };
                        }
                    }
                    else {
                        queries.get("js")!.value.where = where
                    }
                }
                else {
                    if (this.plugins.get(curretLevel.left.value.split(".")[0])?.getCapabilities().has(Capabilities.FILTER)) {
                        queries.get(curretLevel.left.value.split(".")[0])!.value.where = { ...where };
                    }
                    else {
                        queries.get("js")!.value.where = { ...where }
                    }
                }
            }
        }
    }

    handleFrom(queries: Map<string, SQLResponse>, from: any) {
        queries.get(from.value.value.value.value)!.value.from = { ...from };
    }

    handleJoin(queries: Map<string, SQLResponse>, from: any) {
        const data = from.value.value;

        if (data.left.value.value.split(".")[0] == data.right.value.value.split(".")[0]) {
            if (this.plugins.get(data.left.value.value.split(".")[0])?.getCapabilities().has(Capabilities.JOIN)) {
                queries.get(data.left.value.value.split(".")[0])!.value.from = { ...from };
            }
            else {
                queries.get("js")!.value.from = { ...from };
            }
        }
        else {
            queries.get("js")!.value.from = { ...from };
        }
    }
}


