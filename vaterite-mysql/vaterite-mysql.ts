import { Capabilities, VateritePlugin } from "vaterite";

export class VateriteMysql implements VateritePlugin{
    capabilities: Set<Capabilities> = new Set();
    connectionObject: Object = {};
    Scan(): Object {
        throw new Error("Method not implemented.");
    }
    Project(): Object {
        throw new Error("Method not implemented.");
    }
    Filter(): Object {
        throw new Error("Method not implemented.");
    }
    Join(): Object {
        throw new Error("Method not implemented.");
    }

}