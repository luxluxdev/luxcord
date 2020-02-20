const fs = require("fs");
const path = require("path");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const getLowdb = file => lowdb(new FileSync(file));

exports.run = function (client) {
  if (!client.opts.usedb) return;

  // set up
  client.vlog("db", "setup", "started");
  let root = client.opts.dbInternal ? __dirname : client.opts.dbdir;

  if (!fs.existsSync(root)) {
    client.vlog("db", "setup", "root not found, creating directory");
    fs.mkdirSync(root);
  }

  client.db = function (...params) {
    let dbName = (params.pop() || "main");
    let fileName = `${["db", ...params].join("_")}_${dbName}.json`;
    let folderPath = path.join(root, ...params);
    let filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(folderPath)) {
      client.vlog("db", "fs", `${folderPath} not found, creating...`);
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      client.vlog("db", "fs", `${filePath} not found, creating...`);
      fs.writeFileSync(filePath, "{}");
    }

    return getLowdb(filePath);
  }

  // complete
  client.vlog("db", "setup", "complete");
}