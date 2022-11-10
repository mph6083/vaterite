export interface VateritePlugin {
    capabilities: Set<Capabilities>;
    connectionObject: Object;
    execQuery(query: any): Promise<any>;
    getCapabilities(): Set<Capabilities>;
}
export declare enum Capabilities {
    PROJECT = 0,
    FILTER = 1,
    JOIN = 2
}
