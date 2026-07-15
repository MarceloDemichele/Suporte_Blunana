"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputTempPath = exports.outputReportsPath = exports.outputLogsPath = exports.outputScreenshotsPath = exports.outputPath = exports.outputRoot = exports.outputTempRoot = exports.outputReportsRoot = exports.outputLogsRoot = exports.outputScreenshotsRoot = exports.outputJsonRoot = exports.outputDomain = void 0;
exports.ensureOutputRoot = ensureOutputRoot;
exports.ensureOutputScreenshotsRoot = ensureOutputScreenshotsRoot;
exports.ensureOutputLogsRoot = ensureOutputLogsRoot;
exports.ensureOutputReportsRoot = ensureOutputReportsRoot;
exports.ensureOutputTempRoot = ensureOutputTempRoot;
require("./loadEnv");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const environment_1 = require("./environment");
exports.outputDomain = process.env.OUTPUT_DOMAIN || "blunana";
exports.outputJsonRoot = process.env.OUTPUT_JSON_DIR || process.env.OUTPUT_DIR || path_1.default.join("outputs", "json", exports.outputDomain, environment_1.currentEnvironment);
exports.outputScreenshotsRoot = process.env.OUTPUT_SCREENSHOTS_DIR || path_1.default.join("outputs", "screenshots", exports.outputDomain, environment_1.currentEnvironment);
exports.outputLogsRoot = process.env.OUTPUT_LOGS_DIR || path_1.default.join("outputs", "logs", exports.outputDomain, environment_1.currentEnvironment);
exports.outputReportsRoot = process.env.OUTPUT_REPORTS_DIR || path_1.default.join("outputs", "relatorios", exports.outputDomain, environment_1.currentEnvironment);
exports.outputTempRoot = process.env.OUTPUT_TEMP_DIR || path_1.default.join("outputs", "temp", exports.outputDomain, environment_1.currentEnvironment);
exports.outputRoot = exports.outputJsonRoot;
const outputPath = (...segments) => path_1.default.join(exports.outputJsonRoot, ...segments);
exports.outputPath = outputPath;
const outputScreenshotsPath = (...segments) => path_1.default.join(exports.outputScreenshotsRoot, ...segments);
exports.outputScreenshotsPath = outputScreenshotsPath;
const outputLogsPath = (...segments) => path_1.default.join(exports.outputLogsRoot, ...segments);
exports.outputLogsPath = outputLogsPath;
const outputReportsPath = (...segments) => path_1.default.join(exports.outputReportsRoot, ...segments);
exports.outputReportsPath = outputReportsPath;
const outputTempPath = (...segments) => path_1.default.join(exports.outputTempRoot, ...segments);
exports.outputTempPath = outputTempPath;
function ensureOutputRoot() {
    fs_1.default.mkdirSync(exports.outputJsonRoot, { recursive: true });
}
function ensureOutputScreenshotsRoot() {
    fs_1.default.mkdirSync(exports.outputScreenshotsRoot, { recursive: true });
}
function ensureOutputLogsRoot() {
    fs_1.default.mkdirSync(exports.outputLogsRoot, { recursive: true });
}
function ensureOutputReportsRoot() {
    fs_1.default.mkdirSync(exports.outputReportsRoot, { recursive: true });
}
function ensureOutputTempRoot() {
    fs_1.default.mkdirSync(exports.outputTempRoot, { recursive: true });
}
