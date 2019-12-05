exports.run = function () {

  try {
    const lowdb = require('lowdb');
  } catch (err) {
    return this.vlog("addons > perServerPrefixes > lowdb not found.");
  }

  


  this.addons.perServerPrefixes = {};

  const FileSync = require('lowdb/adapters/FileSync')

  const adapter = new FileSync('db.json')
  const db = lowdb(adapter)
}