exports.run = (client, options) => {
  client.opts = {
    name: "luxcord",
    token: undefined,
    verbose: false,
    masterPrefix: ".",
    cmdDirectory: "./cmd",
    evtDirectory: "./evt",
    modules: [],
    ...options
  }
  
  const events = [
    "ready",
    "message"
  ];

  events.forEach(e => client.on(e, require("./events/" + e + ".js").run.bind(client)));

  require("./discord.js").run(client);
  
  client.login(client.opts.token);
}