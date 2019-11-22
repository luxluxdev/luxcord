exports.run = (client) => {
  let Discord = this.Discord;
  
  // client.log
  if (client.opts.verbose)
    client.log = str => console.log(client.opts.name + " > " + str);
  else
    client.log = () => {};

  // client.cmd
  client.commands = new Map();
  client.commands.getFromAlias = function (alias) {
    return [...client.commands.values()].reverse().find(cmd => {
      if (!cmd.opts.aliases) return false;
      return cmd.opts.aliases.includes(alias)
    });
  }

  client.cmd = function(opts, f) {
    if (typeof(opts) === "string") opts = {name: opts};

    client.commands.set(opts.name, {
      opts: opts,
      run: f
    });

    client.log("command registered: " + opts.name);

    return client;
  }

  // client.evt
  client.evt = function(evt, f) {
    client.on(evt, f);
    client.log("event registered: " + evt);
    return client;
  }
}