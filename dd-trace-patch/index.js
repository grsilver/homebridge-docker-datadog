"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// /homebridge/node_modules/homebridge-wiz-lan/dist/index.js
const tracer = require('dd-trace').init({
    env:"dev"
    ,service:"homebridge-wiz-lan"
    ,version:"00.00.001"
    ,tags: {
        tag1:"val1"
        ,docker_service:"yes"
    }
});


const constants_1 = require("./constants");
const wiz_1 = __importDefault(require("./wiz"));
module.exports = (api) => {
    api.registerPlatform(constants_1.PLUGIN_NAME, wiz_1.default);
};
//# sourceMappingURL=index.js.mapdocker 