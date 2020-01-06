const fs = require("fs");
const path = require("path");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const getLowdb = file => lowdb(new FileSync(file));

exports.run = function (client) {
  if (!client.opts.usedb) return;

  // set up
  client.vlog("db", "setup", "checking for database folders");
  let root = client.opts.dbInternal ? __dirname : client.opts.dbdir;
  let dbPath = path.join(root, "db_main.json");
  let sdbPath = path.join(root, "./sdb/");
  let udbPath = path.join(root, "./udb/");
  let sudbPath = path.join(root, "./sudb/");
  let cfgPath = path.join(client.opts.cfgdir, "/luxcord.json");

  if (!fs.existsSync(root)) {
    client.vlog("db", "setup", "root not found, creating directory");
    fs.mkdirSync(root);
  }

  if (!fs.existsSync(dbPath)) {
    client.vlog("db", "setup", "db_main.json not found, creating db_main.json");
    fs.writeFileSync(dbPath, "{}");
  }

  for (let path of [sdbPath, udbPath, sudbPath]) {
    if (!fs.existsSync(path)) {
      client.vlog("db", "setup", `database folder not found, creating ${path}`);
      fs.mkdirSync(path);
    }
  }

  client.vlog("db", "setup", "check complete");

  // main database
  client.vlog("db", "setup", "db");
  client.db = getLowdb(dbPath);

  // cfg database
  client.vlog("db", "setup", "cfgdb");
  if (fs.existsSync(cfgPath))
    client.cfgdb = getLowdb(cfgPath);
  else
    client.vlog("db", "setup", "cfgdb", "not found, client.cfgdb is now undefined");
  
  // sdb databases
  client.vlog("db", "setup", "sdb");
  client.sdb = serverId => {
    //if (!client.guilds.get(serverId)) return undefined;
    let sPath = path.join(sdbPath, `sdb_${serverId}.json`);
    if (!fs.existsSync(sPath)) {
      client.vlog("sdb", `Creating sdb_${serverId}.json`);
      fs.writeFileSync(sPath, "{}");
    }
    return getLowdb(sPath);
  }
  
  // udb databases
  client.vlog("db", "setup", "udb");
  client.udb = userId => {
    //if (!client.users.get(userId)) return undefined;
    let uPath = path.join(udbPath, `udb_${userId}.json`);
    if (!fs.existsSync(uPath)) {
      client.vlog("udb", `Creating udb_${userId}.json`);
      fs.writeFileSync(uPath, "{}");
    }
    return getLowdb(uPath);
  }
  
  // sudb databases
  client.vlog("db", "setup", "sudb");
  client.sudb = (serverId, userId) => {
    //
    let suPath = path.join(sudbPath, `sudb_${serverId}_${userId}.json`);
    if (!fs.existsSync(suPath)) {
      client.vlog("sudb", `Creating sudb_${serverId}_${userId}.json`);
      fs.writeFileSync(suPath, "{}");
    }
    return getLowdb(suPath);
  }

  // complete
  client.vlog("db", "setup", "complete");
}

/*

  example folder structure    

  db/
    db_main.json
    sdb/
      sdb_1974374927573225.json
      sdb_1924872934872349.json
    udb/
      udb_3849724320482352.json
      udb_1298723948237583.json
    sudb/
      sdb_1974374927573225_3849724320482352.json
      sdb_1974374927573225_1298723948237583.json
      sdb_1924872934872349_3849724320482352.json
      sdb_1924872934872349_1298723948237583.json

*/