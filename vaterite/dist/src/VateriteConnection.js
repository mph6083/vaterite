"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VateriteConnection = void 0;
class VateriteConnection {
    constructor() {
        this.plugins = new Map();
    }
    static async initConnections(connectionObject) {
        const vateriteConnection = new VateriteConnection(); // initalize a vaterite connection
        // loop through the plugins and import them and set the connection object for each plugin.
        for (const db in Object.entries(connectionObject)) {
            const dbname = db[0];
            const dbconnectionValue = db[1];
            const plugin = await Promise.resolve().then(() => __importStar(require(`vaterite-${dbname}`)));
            plugin.connectionObject = dbconnectionValue;
            vateriteConnection.plugins.set(db, plugin);
        }
        return vateriteConnection;
    }
}
exports.VateriteConnection = VateriteConnection;
