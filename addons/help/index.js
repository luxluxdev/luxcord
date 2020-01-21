exports.run = function () {
  let opts = {
    name: "help",
    args: {
      cmd: "string?"
    },
    aliases: ["?"],
    desc: "Command List. Use [cmd] to know more about a specific command."
  }

  let run = function (message) {
    // show help for one command
    if (message.args.cmd) return commandDetails.call(this, message);

    // show all commands
    allCommands.call(this, message);
  }

  this.cmd(opts, run);
}

// show help for one command
function commandDetails(message) {
  let cmd = message.args.cmd;
  let command = this.commands.get(cmd) || this.commands.getFromAlias(cmd);

  if (!command) return message.channel.embed("Error", "Command `" + cmd + "` not found");

  let desc = "";
  
  for (let arg in command.opts.args) {
    if (this.opts.fullSyntaxError)
      desc += " <" + arg + ": " + command.opts.args[arg] + ">";
    else
      if (command.opts.args[arg].endsWith("?"))
        desc += " [" + arg + "]";
      else
        desc += " <" + arg + ">";
  }

  let cmddesc = command.opts.desc || " ";
  let cmdex = command.opts.example || " ";

  let syntax = "Syntax:```" + this.opts.prefix + command.opts.name + desc + "```";
  if (cmdex && cmdex !== " ") syntax += "\nExample Usage:```" + this.opts.prefix + command.opts.name + " " + cmdex + "```";
  if (cmddesc && cmddesc !== " ") syntax += "\nDescription:```" + cmddesc + "```";

  message.channel.embed("Help for '" + command.opts.name + "'", syntax, null, "< >: required argument, [ ]: optional argument");

  return;
}

// show all commands
function allCommands(message) {
  let embed = new this.Discord.RichEmbed()
    .setTitle("Help Menu")
    .setDescription("Here's a list of all commands ordered by permissions")
    .setThumbnail(this.user.avatarURL)
    .setFooter(`Use "${this.opts.prefix}help [cmd]" to get more details`)
    .setColor(this.opts.color)
  ;

  if (this.cfgdb) for (let sub in this.cfgdb.get("cmdAuth.subs").value())
    embed.addField(sub, subCommands.call(this, sub));

  embed.addField(this.opts.defaultRankName, restCommands.call(this));

  message.channel.send(embed);
}

function subCommands(sub) {
  // get all commands in sub
  let subArray = this.cfgdb.get(`cmdAuth.subs.${sub}`).value();
  let desc = "";
  // for all commands in sub
  for (let cmd of [...this.commands].map(x => x[1]).filter(x => subArray.includes(x.opts.name))) {
    desc += "- `" + this.opts.prefix + cmd.opts.name;
    for (let arg in cmd.opts.args) {
      if (this.opts.fullSyntaxError)
        desc += " <" + arg + ": " + cmd.opts.args[arg] + ">";
      else
        if (cmd.opts.args[arg].endsWith("?"))
          desc += " [" + arg + "]";
        else
          desc += " <" + arg + ">";
    }
    desc += "`\n";
  }
  return desc;
}

function restCommands() {
  let allSubCommands = [];
  let subs = this.cfgdb.get("cmdAuth.subs").value();
  if (this.cfgdb) for (let sub in subs) {
    allSubCommands.push(...subs[sub]);
  }
  // for all commands not in any subs
  let desc = "";
  for (let cmd of [...this.commands].map(x => x[0]).filter(x => !allSubCommands.includes(x))) {
    desc += "- `" + this.opts.prefix + cmd.opts.name;
    for (let arg in cmd.opts.args) {
      if (this.opts.fullSyntaxError)
        desc += " <" + arg + ": " + cmd.opts.args[arg] + ">";
      else
        if (cmd.opts.args[arg].endsWith("?"))
          desc += " [" + arg + "]";
        else
          desc += " <" + arg + ">";
    }
    desc += "`\n";
  }
  return desc;
}