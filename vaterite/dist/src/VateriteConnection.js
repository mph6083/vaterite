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
const VateritePluginInterface_1 = require("./VateritePluginInterface");
const js_sql_parser_1 = require("js-sql-parser");
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
    async execQuery(query) {
        const queries = new Map();
        const queryObject = js_sql_parser_1.Parser.parse(query);
        this.createQueryObjects(queries, queryObject);
        this.optimizeQueries(queries, queryObject);
        const pluginResponses = await this.getPluginResponses(queries);
        return this.JsExecutor(pluginResponses, queries.get("js"));
        //find tables
    }
    async JsExecutor(pluginResponses, jsInstructions) {
        //
        const processedpluginResponses = this.preProcessResponses(pluginResponses);
        //join
        let rows = this.JsJoin(processedpluginResponses, jsInstructions.value.from);
        //where
        rows = this.jsWhere(rows, jsInstructions.value.where);
        // select
        rows = this.jsSelect(rows, jsInstructions.value.selectItems);
    }
    preProcessResponses(pluginResponses) {
        const newResponses = new Map();
        for (let [key, value] of pluginResponses) {
            let newValue = value.map((val) => {
                let newVal = {};
                for (let object in Object.entries(val)) {
                    let newkey = key + "." + object[0];
                    newVal[newkey] = object[1];
                }
                return newVal;
            });
            newResponses.set(key, newValue);
        }
        return newResponses;
    }
    JsJoin(pluginResponses, from) {
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
                    newReturnArray.push(Object.assign(Object.assign({}, olditem), newitem));
                }
            }
            returnArray = newReturnArray;
        }
        returnArray = this.jsWhere(returnArray, from.value[0].value.condition.value);
        return returnArray;
    }
    jsWhere(rows, where) {
        // this is awful and brilliant
        return rows.filter((obj) => {
            let left = where.left.type == "Identifier" ? `obj[${where.left.value}]` : where.left.value;
            let right = where.right.type == "Identifier" ? `obj[${where.right.value}]` : where.right.value;
            let stringcond = `${left} ${where.operator} ${right}`;
            return eval(stringcond);
        });
    }
    jsSelect(rows, selectItems) {
        return rows.map((row) => {
            let returnObj = {};
            for (let selector of selectItems.value) {
                returnObj[selector.value] = row[selector.value];
            }
        });
    }
    async getPluginResponses(queries) {
        var _a;
        const retMap = new Map();
        for (let [key, value] of queries) {
            if (key != "js") {
                retMap.set(key, await ((_a = this.plugins.get(key)) === null || _a === void 0 ? void 0 : _a.execQuery(value)));
            }
        }
        return retMap;
    }
    optimizeQueries(queries, queryObject) {
        var _a, _b, _c, _d;
        //parse query
        this.handleSelect(queries, queryObject.value.selectItems);
        this.handleWhere(queries, queryObject.value.where);
        if (((_b = (_a = queryObject.value.from.value) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.type) && ((_d = (_c = queryObject.value.from.value) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.type) == "TableFactor") {
            this.handleFrom(queries, queryObject.value.from);
        }
        else {
            this.handleJoin(queries, queryObject.value.from);
        }
    }
    createQueryObjects(queries, queryObject) {
        const SQLqueryBlank = Object.assign(Object.assign({}, queryObject.value), { selectItems: Object.assign(Object.assign({}, queryObject.value.selectItems), { value: [] }), from: undefined, where: undefined });
        // create a sqlQuery for each plugin in the intance
        for (let plugin of this.plugins.keys()) {
            let queryResponse = Object.assign(Object.assign({}, queryObject), { value: Object.assign({}, SQLqueryBlank) });
            queries.set(plugin, queryResponse);
        }
        //add javasctipt
        let queryResponse = Object.assign(Object.assign({}, queryObject), { value: Object.assign({}, SQLqueryBlank) });
        queries.set("js", queryResponse);
    }
    handleSelect(queries, select) {
        var _a, _b, _c, _d, _e;
        for (let selectIdentifier of select.value) {
            if (selectIdentifier.type == "Identifier") {
                if (selectIdentifier.value.split(".").length == 0) {
                    (_a = queries.get('js')) === null || _a === void 0 ? void 0 : _a.value.selectItems.push(Object.assign({}, selectIdentifier));
                }
                else {
                    if ((_b = this.plugins.get(selectIdentifier.value.split(".")[0])) === null || _b === void 0 ? void 0 : _b.getCapabilities().has(VateritePluginInterface_1.Capabilities.PROJECT)) {
                        (_c = queries.get(selectIdentifier.value.split(".")[0])) === null || _c === void 0 ? void 0 : _c.value.selectItems.push(Object.assign({}, selectIdentifier));
                    }
                    (_d = queries.get('js')) === null || _d === void 0 ? void 0 : _d.value.selectItems.push(Object.assign({}, selectIdentifier));
                }
            }
            else {
                (_e = queries.get('js')) === null || _e === void 0 ? void 0 : _e.value.selectItems.push(Object.assign({}, selectIdentifier));
            }
        }
    }
    handleWhere(queries, where) {
        var _a, _b;
        //to be able to extend it to the specific level
        let curretLevel = where;
        if (curretLevel.left && curretLevel.right) {
            if (curretLevel.left.type == "Identifier") {
                if (curretLevel.right.type == "Identifier") {
                    if (curretLevel.left.value.split(".")[0] == curretLevel.right.value.split(".")[0]) {
                        if ((_a = this.plugins.get(curretLevel.left.value.split(".")[0])) === null || _a === void 0 ? void 0 : _a.getCapabilities().has(VateritePluginInterface_1.Capabilities.FILTER)) {
                        }
                        else {
                            queries.get(curretLevel.left.value.split(".")[0]).value.where = Object.assign({}, where);
                        }
                    }
                    else {
                        queries.get("js").value.where = where;
                    }
                }
                else {
                    if ((_b = this.plugins.get(curretLevel.left.value.split(".")[0])) === null || _b === void 0 ? void 0 : _b.getCapabilities().has(VateritePluginInterface_1.Capabilities.FILTER)) {
                        queries.get(curretLevel.left.value.split(".")[0]).value.where = Object.assign({}, where);
                    }
                    else {
                        queries.get("js").value.where = Object.assign({}, where);
                    }
                }
            }
        }
    }
    handleFrom(queries, from) {
        queries.get(from.value.value.value.value).value.from = Object.assign({}, from);
    }
    handleJoin(queries, from) {
        var _a;
        const data = from.value.value;
        if (data.left.value.value.split(".")[0] == data.right.value.value.split(".")[0]) {
            if ((_a = this.plugins.get(data.left.value.value.split(".")[0])) === null || _a === void 0 ? void 0 : _a.getCapabilities().has(VateritePluginInterface_1.Capabilities.JOIN)) {
                queries.get(data.left.value.value.split(".")[0]).value.from = Object.assign({}, from);
            }
            else {
                queries.get("js").value.from = Object.assign({}, from);
            }
        }
        else {
            queries.get("js").value.from = Object.assign({}, from);
        }
    }
}
exports.VateriteConnection = VateriteConnection;
