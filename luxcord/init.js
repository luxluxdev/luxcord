const path = require("path");
const rootdir = path.dirname(require.main.filename);

exports.Luxcord = function (opts) {
  this.opts = {
    name: "luxcord",              // the bot's internal name
    token: undefined,             // discord oauth bot token
    ownerID: undefined,           // owner's discord id
    ownerBypassAuth: true,        // if the owner bypasses cmdAuth
    prefix: "luxcord.",           // bot global hardcoded prefix
    prefixes: [],                 // bot additional hardcoded prefixes
    color: 0xffffff,              // embed strip color
    verbose: false,               // much more verbose logs,
    logSeparator: " > ",          // log separator
    allowBots: false,             // allow bots to use commands
    allowDMs: false,              // allow commands to run in DMs
    clientArg: false,             // pass client argument to command "run" functions
    argsArg: false,               // pass args argument to command "run" functions
    fullSyntaxError: false,       // syntax errors include argument types
    scancmd: true,                // scan for command modules
    scanevt: true,                // scan for event modules
    scancfg: true,                // scan config files
    cmddir: "./cmd/",             // command module directory
    evtdir: "./evt/",             // event module directory
    cfgdir: "./cfg/",             // config directory
    dbdir: "./db/",               // lowdb database directory
    absdir: false,                // whether the above directories are absolute paths
    dbInternal: false,            // use internal folders for lowdb database files (overrides dbdir)
    usedb: false,                 // use lowdb for luxcord database
    //usesdb: true,                 // use lowdb for per-server database files
    //useudb: true,                 // use lowdb for per-user database files
    //usesudb: true,                // use lowdb for per-server-user database files
    rootdir: rootdir,             // root directory, do not change unless you know what you're doing
    mentionPrefix: true,          // use mention as a prefix
    hardcodedPrefixes: true,      // whether to use the hardcoded prefixes above
    perServerPrefix: false,       // enable per server prefix
    perServerColor: false,        // enable per server embed strip color
    perServerRanks: false,        // enable per server ranks
    globalRanks: true,            // whether to use global ranks
    defaultRankName: "general",   // default rank name if a member has no rank
    addons: [],                   // array of enabled addons, or "default" to use a basic set

    ...opts                       // user overrides
  };

  if (!this.opts.token) return;

  if (!this.opts.absdir) for (let e of ["cmddir", "evtdir", "cfgdir", "dbdir"]) this.opts[e] = path.join(rootdir, this.opts[e]);

  const events = [
    "ready",
    "message"
  ];

  events.forEach(e => this.on(e, require(`./events/${e}.js`).run.bind(this)));

  require("./main/discord.js").run(this);
  
  this.vlog("initializing...");

  require("./main/scan.js").run(this);
  require("./main/db.js").run(this);
  require("./main/addons.js").run(this);
  
  this.vlog("logging in...");
  this.login(this.opts.token);

  return this;
}