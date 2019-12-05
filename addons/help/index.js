exports.run = function () {
  let opts = {
    name: "help",
    args: {
      cmd: "string?"
    },
    aliases: ["?"],
    desc: "lists help menu for the bot's commands"
  }

  let run = function (message) {
    // show help for one command
    if (message.args.cmd) {
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

      let cmddesc = command.opts.desc || "";

      message.channel.embed("Help for '" + command.opts.name + "'", "Usage:```" + this.opts.prefix + command.opts.name + desc + "```\nDescription:```" + cmddesc + "```", null, "< >: required argument, [ ]: optional argument");

      return;
    }

    // show all commands
    let desc = "";

    for (let cmd of [...this.commands].map(x => x[1])) {
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

    message.channel.embed("Help Menu", desc, null, null, null, this.user.avatarURL);
  }

  this.cmd(opts, run);
}