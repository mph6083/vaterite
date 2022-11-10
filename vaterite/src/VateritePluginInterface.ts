export interface VateritePlugin{
    
    capabilities: Set<Capabilities>;
    connectionObject:Object;

    execQuery(query:any):Promise<any>;
    getCapabilities():Set<Capabilities>;
}


export enum Capabilities{
    PROJECT,
    FILTER,
    JOIN,
}
