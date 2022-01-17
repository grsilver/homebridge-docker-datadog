#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomebridgeServiceHelper = void 0;
process.title = 'hb-service';

// /usr/local/lib/node_modules/homebridge-config-ui-x/dist/bin/hb-service.js
const tracer = require('dd-trace').init({
    env:"dev"
    ,service:"hb-service"
    ,version:"00.00.001"
    ,tags: {
        tag1:"val1"
        ,docker_service:"yes"
    }
});


const os = require("os");
const path = require("path");
const commander = require("commander");
const child_process = require("child_process");
const fs = require("fs-extra");
const tcpPortUsed = require("tcp-port-used");
const si = require("systeminformation");
const semver = require("semver");
const ora = require("ora");
const tar = require("tar");
const axios_1 = require("axios");
const tail_1 = require("tail");
const win32_1 = require("./platforms/win32");
const linux_1 = require("./platforms/linux");
const darwin_1 = require("./platforms/darwin");
class HomebridgeServiceHelper {
    constructor() {
        this.selfPath = __filename;
        this.serviceName = 'Homebridge';
        this.usingCustomStoragePath = false;
        this.allowRunRoot = false;
        this.homebridgeStopped = true;
        this.homebridgeOpts = ['-I'];
        this.homebridgeCustomEnv = {};
        this.uiPort = 8581;
        this.nodeVersionCheck();
        switch (os.platform()) {
            case 'linux':
                this.installer = new linux_1.LinuxInstaller(this);
                break;
            case 'win32':
                this.installer = new win32_1.Win32Installer(this);
                break;
            case 'darwin':
                this.installer = new darwin_1.DarwinInstaller(this);
                break;
            default:
                this.logger(`ERROR: This command is not supported on ${os.platform()}.`, 'fail');
                process.exit(1);
        }
        commander
            .allowUnknownOption()
            .storeOptionsAsProperties(true)
            .arguments('[install|uninstall|start|stop|restart|rebuild|run|logs]')
            .option('-P, --plugin-path <path>', '', (p) => { process.env.UIX_CUSTOM_PLUGIN_PATH = p; this.homebridgeOpts.push('-P', p); })
            .option('-U, --user-storage-path <path>', '', (p) => { this.storagePath = p; this.usingCustomStoragePath = true; })
            .option('-S, --service-name <service name>', 'The name of the homebridge service to install or control', (p) => this.serviceName = p)
            .option('-T, --no-timestamp', '', () => this.homebridgeOpts.push('-T'))
            .option('--port <port>', 'The port to set to the Homebridge UI when installing as a service', (p) => this.uiPort = parseInt(p, 10))
            .option('--user <user>', 'The user account the Homebridge service will be installed as (Linux, macOS only)', (p) => this.asUser = p)
            .option('--stdout', '', () => this.stdout = true)
            .option('--allow-root', '', () => this.allowRunRoot = true)
            .option('--docker', '', () => this.docker = true)
            .option('--uid <number>', '', (i) => this.uid = parseInt(i, 10))
            .option('--gid <number>', '', (i) => this.gid = parseInt(i, 10))
            .option('-v, --version', 'output the version number', () => this.showVersion())
            .action((cmd) => {
            this.action = cmd;