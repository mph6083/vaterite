import { Capabilities, VateritePlugin } from "vaterite";
export declare class VateritePostgres implements VateritePlugin {
    constructor();
    execQuery(query: any): Promise<import("pg").QueryResult<any>>;
    getCapabilities(): Set<Capabilities>;
    capabilities: Set<Capabilities>;
    connectionObject: Object;
}
