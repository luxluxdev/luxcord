exports.run = (client) => {
  let Discord = client.Discord;
  
  // client.log and client.vlog (verbose log)
  client.log = (...str) => console.log(indent([client.opts.name, ...str].join(client.opts.logSeparator)));

  if (client.opts.verbose)
    client.vlog = (...str) => console.log(indent([client.opts.name, ...str].join(client.opts.logSeparator)));
  else
    client.vlog = () => {};

  function indent(str) {
    let indent = [...(client.opts.name + client.opts.logSeparator)].reduce((a, b) => a + " ", "");
    
    return str.split("\n").join("\n" + indent);
  }

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

    let override = client.commands.has(opts.name);

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

    client.vlog("register", "cmd", opts.name + (override ? " [override]" : ""));

    return client; // return luxcord client for chained calls
  }

  // client.evt
  client.evt = function(evt, f) {
    client.on(evt, f);
    client.vlog("register", "evt", evt);

    return client; // return luxcord client for chained calls
  }

  // message.syntax
  Discord.Message.prototype.syntax = function (command) {
    let cmd = client.commands.get(command);
    if (!cmd) return -1;

    let desc = "";

    for (let arg in cmd.opts.args) {
      if (client.opts.fullSyntaxError)
        desc += `<${arg}: ${cmd.opts.args[arg]}> `;
      else
        if (cmd.opts.args[arg].endsWith("?"))
          desc += `[${arg}] `;
        else
          desc += `<${arg}> `;
    }

    let syntax = "```" + `${client.opts.prefix}${cmd.opts.name} ${desc.slice(0, -1)}` + "```";
    this.channel.embed("Syntax Error", `Correct Usage: ${syntax}`, null, `Use \`${client.opts.prefix}help ${cmd.opts.name}\` for more details`);

    return -1;
  }
  
  // message.autherr
  Discord.Message.prototype.autherr = function (subs) {
    if (!subs)
      this.channel.embed("Not Authorized", "You must be the bot's owner to use this command");
    else
      this.channel.embed("Not Authorized", `You must have \`${subs.join(" or ")}\` permissions to use this command`);

    return -1;
  }

  // client.embed
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