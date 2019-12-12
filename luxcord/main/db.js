const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

exports.run = function (client) {
  client.vlog("db", "setting up client.db");

  client.db = lowdb(new FileSync("./db/db.json"));
  client.db.defaults({ prefix: client.opts.prefix, color: client.opts.color, ranks: [] }).write();

  client.vlog("db", "success");

  client.vlog("sdb", "setting up client.sdb()");

  // per-server database
  client.sdb = function (id) {
    client.vlog("sdb", `db_${id}`, "read", "start");
    let db = lowdb(new FileSync(`./db/db_${id}.json`));
    db.defaults({ prefix: client.opts.prefix, color: client.opts.color, ranks: [] }).write();
    client.vlog("sdb", `db_${id}`, "read", "end");
    return db;
  }

  client.vlog("sdb", "success");
}