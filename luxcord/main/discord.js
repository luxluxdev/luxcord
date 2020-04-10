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
  Discord.Message.prototype.autherr = function (ranks) {
    if (!ranks)
      this.channel.embed("Not Authorized", "You don't have permission.");
    else
      this.channel.embed("Not Authorized", `You must have \`${(ranks.length == 1) ? (ranks[0]) : (`${ranks.slice(0, -1).join("\`, \`")}\` or \`${ranks[ranks.length - 1]}`)}\` permissions to use this command`);

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

  // message.editEmbed
  Discord.Message.prototype.editEmbed = function (...embedParams) {
    return new Promise((resolve, reject) => {
      this.edit(client.embed(...embedParams))
      .then(msg => resolve(msg))
      .catch(err => reject(err));
    });
  }
  
  // template embed promise function
  const embed = function (...embedParams) {
    return new Promise((resolve, reject) => {
      this.send(client.embed(...embedParams))
      .then(msg => resolve(msg))
      .catch(err => reject(err));
    });
  }
  
  const protoembed = object => object.prototype.embed = embed;

  // client.embedcolor
  client.embedcolor = (color, title, description, image, footer, timestamp, thumbnail) => {
    return {embed: {
      title: title,
      description: description,
      image: {url: image},
      footer: {text: footer},
      timestamp: timestamp,
      thumbnail: {url: thumbnail},
      color: color
    }}
  }

  // message.editEmbedColor
  Discord.Message.prototype.editEmbedColor = function (...embedParams) {
    return new Promise((resolve, reject) => {
      this.edit(client.embedcolor(...embedParams))
      .then(msg => resolve(msg))
      .catch(err => reject(err));
    });
  }
  
  // template embedcolor promise function
  const embedcolor = function (...embedParams) {
    return new Promise((resolve, reject) => {
      this.send(client.embedcolor(...embedParams))
      .then(msg => resolve(msg))
      .catch(err => reject(err));
    });
  }
  
  const protoembedcolor = object => object.prototype.embed = embedcolor;
  
  discordobjects.forEach(x => {protoembed(x); protoembedcolor(x)});
}