import { Capabilities, VateritePlugin } from "vaterite";
export declare class VateriteMysql implements VateritePlugin {
    capabilities: Set<Capabilities>;
    connectionObject: Object;
    Scan(): Object;
    Project(): Object;
    Filter(): Object;
    Join(): Object;
}
