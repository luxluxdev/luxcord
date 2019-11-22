const path = require("path");
const rootdir = path.dirname(require.main.filename);

exports.Luxcord = function (opts) {
  this.opts = {
    name: "luxcord",
    token: undefined,
    ownerID: undefined,
    verbose: false,
    allowBots: false,
    clientArg: false,
    argsArg: false,
    prefix: "luxcord.",
    cmddir: "./cmd/",
    evtdir: "./evt/",
    cfgdir: "./cfg/",
    absdir: false,
    rootdir: rootdir,
    addons: [],

    ...opts
  };

  if (!this.opts.absdir) ["cmddir", "evtdir", "cfgdir"].forEach(e => this.opts[e] = path.join(rootdir, this.opts[e]));

  const events = [
    "ready",
    "message"
  ];

  events.forEach(e => this.on(e, require("./events/" + e + ".js").run.bind(this)));

  require("./main/discord.js").run(this);
  require("./main/scan.js").run(this);
  
  this.login(this.opts.token);

  return this;
}