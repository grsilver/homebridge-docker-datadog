#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.title = 'homebridge-config-ui-x';

// /usr/local/lib/node_modules/homebridge-config-ui-x/dist/bin/standalone.js
const tracer = require('dd-trace').init({
    env:"dev"
    ,service:"homebridge-config-ui-x"
    ,version:"00.00.001"
    ,tags: {
        tag1:"val1"
        ,docker_service:"yes"
    }
});



const os = require("os");
const path = require("path");
const commander = require("commander");
commander
    .allowUnknownOption()
    .option('-U, --user-storage-path [path]', '', (p) => process.env.UIX_STORAGE_PATH = p)
    .option('-P, --plugin-path [path]', '', (p) => process.env.UIX_CUSTOM_PLUGIN_PATH = p)
    .option('-I, --insecure', '', () => process.env.UIX_INSECURE_MODE = '1')
    .option('-T, --no-timestamp', '', () => process.env.UIX_LOG_NO_TIMESTAMPS = '1')
    .parse(process.argv);
if (!process.env.UIX_STORAGE_PATH) {
    process.env.UIX_STORAGE_PATH = path.resolve(os.homedir(), '.homebridge');
}
process.env.UIX_CONFIG_PATH = path.resolve(process.env.UIX_STORAGE_PATH, 'config.json');
Promise.resolve().then(() => require('../main'));
//# sourceMappingURL=standalone.js.map