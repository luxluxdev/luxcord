const path = require("path");
const rootDir = path.dirname(require.main.filename);

exports.run = (client, options) => {
  client.opts = {
    name: "luxcord",
    token: undefined,
    ownerID: undefined,
    verbose: false,
    allowBots: false,
    masterPrefix: ".",
    prefixes: [],
    cmdDirectory: "./cmd",
    evtDirectory: "./evt",
    rootDir: rootDir,
    modules: [],

    ...options
  }

  client.opts.cmdDirectory = path.join(rootDir, client.opts.cmdDirectory);
  client.opts.evtDirectory = path.join(rootDir, client.opts.evtDirectory);
  
  const events = [
    "ready",
    "message"
  ];

  events.forEach(e => client.on(e, require("./events/" + e + ".js").run.bind(client)));

  require("./main/discord.js").run(client);
  
  client.login(client.opts.token);
}