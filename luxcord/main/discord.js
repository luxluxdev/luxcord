exports.run = (client) => {
  let Discord = client.Discord;
  
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

  // message.syntax
  Discord.Message.prototype.syntax = function (command) {
    let cmd = client.commands.get(command);
    if (!cmd) return -1;

    let desc = "";

    for (let arg in cmd.opts.args) {
      if (client.opts.fullSyntaxError)
        desc += "<" + arg + ": " + cmd.opts.args[arg] + "> ";
      else
        if (cmd.opts.args[arg].endsWith("?"))
          desc += "[" + arg + "] ";
        else
          desc += "<" + arg + "> ";
    }

    this.channel.embed("Syntax Error", "Correct Usage: ```" + client.opts.prefix + cmd.opts.name + " " + desc.slice(0, -1) + "```");

    return -1;
  }

  // channel.embed
  client.embed = (title, description, image, footer, timestamp, thumbnail) => {
    return {embed: {
      title: title,
      description: description,
      image: {url: image},
      footer: {text: footer},
      timestamp: timestamp,
      thumbnail: {url: thumbnail},
      color: client.opts.color
    }}
  }
  
  // template embed promise function
  const embed = function (title, description, image, footer, timestamp, thumbnail) {
    return new Promise((resolve, reject) => {
      this.send(client.embed(title, description, image, footer, timestamp, thumbnail))
      .then(msg => resolve(msg))
      .catch(err => reject(err));
    })
  }
  
  const protoembed = object => object.prototype.embed = embed;
  
  const discordobjects = [
    Discord.TextChannel,
    Discord.DMChannel,
    Discord.User,
    Discord.GuildMember
  ];
  
  discordobjects.forEach(x => protoembed(x));
}