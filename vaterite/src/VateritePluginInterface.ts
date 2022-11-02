export interface VateritePlugin{
    
    capabilities: Set<Capabilities>;
    connectionObject:Object;

    Scan():Object;

    Project():Object;
    Filter():Object;
    Join():Object;
}


export enum Capabilities{
    SCAN,
    PROJECT,
    FILTER,
    JOIN,

}
