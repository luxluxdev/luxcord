const path = require("path");
const rootdir = path.dirname(require.main.filename);

exports.Luxcord = function (opts) {
  this.opts = {
    name: "luxcord",              // the bot's internal name
    token: undefined,             // discord oauth bot token
    prefix: "luxcord.",           // bot global prefix
    ownerID: undefined,           // owner's discord id, to bypass ranks
    verbose: false,               // much more verbose logs
    allowBots: false,             // allow bots to use commands
    allowDMs: false,              // allow commands to run in DMs
    clientArg: false,             // pass client argument to command "run" functions
    argsArg: false,               // pass args argument to command "run" functions
    fullSyntaxError: false,       // syntax errors include argument types
    scancmd: true,                // scan for command modules
    scanevt: true,                // scan for event modules
    cmddir: "./cmd/",             // command module directory
    evtdir: "./evt/",             // event module directory
    cfgdir: "./cfg/",             // config directory
    absdir: false,                // whether the above directories are absolute paths
    rootdir: rootdir,             // root directory, do not change unless you know what you're doing
    color: 0xffffff,              // embed strip color
    addons: [],                   // enabled addons

    ...opts                       // user overrides
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