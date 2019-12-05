const requireall = require("require-all");
const path = require("path");

exports.run = (client) => {
  client.addons = {};
  
  let addons = client.opts.addons;

  let addonfolders = requireall(path.join(__dirname, "../../addons/"));

  if (!addons || addons.length == 0) return client.vlog("addons", "no addons enabled");

  client.vlog("addons", "checking addons...");

  for (let addon of addons) {
    if (!Object.keys(addonfolders).includes(addon)) {
      client.vlog("addons", addon, "is not a valid addon");
      continue;
    }

    client.vlog("addons", addon, "initialized");
    require(path.join(__dirname, "../../addons/", addon, "/index.js")).run.call(client);
  }
}