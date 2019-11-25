exports.run = (client) => {
  let Discord = this.Discord;
  
  // client.log
  client.log = str => console.log(client.opts.name + " > " + str);

  if (client.opts.verbose)
    client.vlog = str => console.log(client.opts.name + " > " + str);
  else
    client.vlog = () => {};

  // client.cmd
  client.commands = new Map();
  client.commands.getFromAlias = function (alias) {
    return [...client.commands.values()].reverse().find(cmd => {
      if (!cmd.opts || !cmd.opts.aliases) return false;
      return cmd.opts.aliases.includes(alias);
    });
  }

  client.cmd = function(opts, f) {
    if (typeof(opts) === "string") opts = {name: opts};

    if (typeof(f) === "string") {
      client.commands.set(opts.name, {
        opts: opts,
        run: function (message) {
          message.channel.send(f);
        }
      });
    }
    else {
      client.commands.set(opts.name, {
        opts: opts,
        run: f
      });
    }

    client.vlog("registered command: " + opts.name);

    return client;
  }

  // client.evt
  client.evt = function(evt, f) {
    client.on(evt, f);
    client.vlog("registered event: " + evt);
    return client;
  }
}