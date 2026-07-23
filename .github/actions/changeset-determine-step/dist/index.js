"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .github/actions/changeset-determine-step/main.ts
var import_child_process = require("child_process");
var import_fs = __toESM(require("fs"));
var core = __toESM(require("@actions/core"));
try {
  const random = Math.random().toString(36).slice(2, 10);
  const statusPath = `changeset-status-${random}.json`;
  (0, import_child_process.execSync)(`npx changeset status --output "${statusPath}"`, { stdio: "inherit" });
  const status = JSON.parse(import_fs.default.readFileSync(statusPath, "utf-8"));
  console.log(`[determine-changeset-status] status=${JSON.stringify(status, null, 2)}`);
  import_fs.default.unlinkSync(statusPath);
  let action = "none";
  if (status.changesets && status.changesets.length > 0) {
    action = "pr";
  } else {
    const pkg = JSON.parse(import_fs.default.readFileSync("package.json", "utf-8"));
    const currentVersion = pkg.version;
    console.log(`[determine-changeset-action] currentVersion=${currentVersion}`);
    try {
      (0, import_child_process.execSync)(`git fetch --tags`);
      (0, import_child_process.execSync)(`git rev-parse --verify --quiet v${currentVersion}`);
    } catch {
      action = "publish";
    }
  }
  core.setOutput("action", action);
  console.log(`[determine-changeset-action] action=${action}`);
} catch (err) {
  if (err instanceof Error) {
    core.setFailed(err.message);
  } else {
    core.setFailed(String(err));
  }
}
