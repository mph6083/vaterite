import { SQLResponse } from "js-sql-parser";
export declare class VateriteConnection {
    private plugins;
    private constructor();
    static initConnections(connectionObject: Object): Promise<VateriteConnection>;
    execQuery(query: string): Promise<void>;
    JsExecutor(pluginResponses: Map<string, Array<any>>, jsInstructions: SQLResponse): Promise<void>;
    preProcessResponses(pluginResponses: Map<string, Array<any>>): Map<string, Array<any>>;
    JsJoin(pluginResponses: Map<string, Array<any>>, from: any): any[];
    jsWhere(rows: any[], where: any): any[];
    jsSelect(rows: any[], selectItems: any): any[];
    getPluginResponses(queries: Map<string, SQLResponse>): Promise<Map<string, Array<any>>>;
    optimizeQueries(queries: Map<string, SQLResponse>, queryObject: SQLResponse): void;
    createQueryObjects(queries: Map<string, SQLResponse>, queryObject: SQLResponse): void;
    handleSelect(queries: Map<string, SQLResponse>, select: any): void;
    handleWhere(queries: Map<string, SQLResponse>, where: any): void;
    handleFrom(queries: Map<string, SQLResponse>, from: any): void;
    handleJoin(queries: Map<string, SQLResponse>, from: any): void;
}
