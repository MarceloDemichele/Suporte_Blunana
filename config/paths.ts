import "./loadEnv";
import fs from "fs";
import path from "path";
import { currentEnvironment } from "./environment";

export const outputDomain = process.env.OUTPUT_DOMAIN || "blunana";

export const outputJsonRoot =
  process.env.OUTPUT_JSON_DIR || process.env.OUTPUT_DIR || path.join("outputs", "json", outputDomain, currentEnvironment);

export const outputScreenshotsRoot =
  process.env.OUTPUT_SCREENSHOTS_DIR || path.join("outputs", "screenshots", outputDomain, currentEnvironment);

export const outputLogsRoot = process.env.OUTPUT_LOGS_DIR || path.join("outputs", "logs", outputDomain, currentEnvironment);

export const outputReportsRoot =
  process.env.OUTPUT_REPORTS_DIR || path.join("outputs", "relatorios", outputDomain, currentEnvironment);

export const outputTempRoot = process.env.OUTPUT_TEMP_DIR || path.join("outputs", "temp", outputDomain, currentEnvironment);

export const outputRoot = outputJsonRoot;

export const outputPath = (...segments: string[]) => path.join(outputJsonRoot, ...segments);

export const outputScreenshotsPath = (...segments: string[]) => path.join(outputScreenshotsRoot, ...segments);

export const outputLogsPath = (...segments: string[]) => path.join(outputLogsRoot, ...segments);

export const outputReportsPath = (...segments: string[]) => path.join(outputReportsRoot, ...segments);

export const outputTempPath = (...segments: string[]) => path.join(outputTempRoot, ...segments);

export function ensureOutputRoot() {
  fs.mkdirSync(outputJsonRoot, { recursive: true });
}

export function ensureOutputScreenshotsRoot() {
  fs.mkdirSync(outputScreenshotsRoot, { recursive: true });
}

export function ensureOutputLogsRoot() {
  fs.mkdirSync(outputLogsRoot, { recursive: true });
}

export function ensureOutputReportsRoot() {
  fs.mkdirSync(outputReportsRoot, { recursive: true });
}

export function ensureOutputTempRoot() {
  fs.mkdirSync(outputTempRoot, { recursive: true });
}
