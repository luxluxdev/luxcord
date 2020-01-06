exports.run = function () {
  if (!this.cfgdb) return this.vlog("addons", "quickranks", "client.cfgdb undefined");

  let static = this.cfgdb.get("cmdAuth").value();
  let cfg = this.cfgdb;

  function log(...x) { this.vlog("quickranks", ...x); };

  let qr = {};

  // new
  qr.new = function (rank, server = "global", override = false) {
    log("new", `rank: ${rank}`, `server: ${server}`, `override: ${override}`);

    if (!static[server][rank] || override) {
      cfg.set(`cmdAuth.${server}.${rank}`, {}).write();
    }

    return qr;
  };

  // set
  qr.set = function (rank, key, value = [], server = "global", override = true) {
    log("set", `rank: ${rank}`, `key: ${key}`, `value: ${value}`, `server: ${server}`, `override: ${override}`);

    if (!static[server][rank][key] || override) {
      cfg.set(`cmdAuth.${server}.${rank}.${key}`, value).write();
    }

    return qr;
  }

  // add
  qr.add = function (rank, key, value, server = "global") {
    // use a set to ensure all entries are unique
    let set = new Set(static[server][rank][key]).add(value);
    cfg.set(`cmdAuth.${server}.${rank}.${key}`, Array.from(set)).write();

    return qr;
  }

  // rem
  qr.rem = function (rank, key, value, server = "global") {
    cfg.get(`cmdAuth.${server}.${rank}.${key}`).pull(value).write();

    return qr;
  }

  // newSub
  qr.newSub = function (sub, override = false) {
    if (!static.subs[sub] || override) {
      cfg.set(`cmdAuth.subs.${sub}`, []).write();
    }

    return qr;
  }

  // setSub
  qr.setSub = function (sub, cmds, override = true) {
    if (!static.subs[sub] || override) {
      cfg.set(`cmdAuth.subs.${sub}`, cmds).write();
    }

    return qr;
  }

  // addSub
  qr.addSub = function (sub, cmd) {
    // use a set to ensure all entries are unique
    let set = new Set(static.subs[sub]).add(cmd);
    cfg.set(`cmdAuth.subs.${sub}`, Array.from(set)).write();

    return qr;
  }

  // remSub
  qr.remSub = function (sub, cmd) {
    cfg.get(`cmdAuth.subs.${sub}`).pull(cmd).write();

    return qr;
  }

  this.quickranks = qr;
}

/*

"mod": {
  "perms": [],
  "userids": [],
  "roleids": [],
  "rolenames": [],
  "subs": []
}

*/