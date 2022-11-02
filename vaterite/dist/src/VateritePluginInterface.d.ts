export interface VateritePlugin {
    capabilities: Set<Capabilities>;
    connectionObject: Object;
    Scan(): Object;
    Project(): Object;
    Filter(): Object;
    Join(): Object;
}
export declare enum Capabilities {
    SCAN = 0,
    PROJECT = 1,
    FILTER = 2,
    JOIN = 3
}
