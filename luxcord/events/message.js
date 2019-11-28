const path = require("path");

exports.run = function (message) {
  if (message.channel.type === "dm" && !client.opts.allowDMs) return;

  let embeds = message.embeds.reduce((a,b) => a + "[embed: " + (b.title || b.author.name || b.description) + "]", "");
  this.vlog("message > " + message.author.tag + ": " + message.content + embeds);

  //require("../main/premsg.js").run.call(this, message);
  
  if (!this.opts.allowBots && message.author.bot) return;
  if (message.author.id == this.user.id) return;
  
  if (message.content === this.opts.masterPrefix + "ping") message.reply("pong!");

  let prefixes = [this.user.toString(), this.opts.prefix];
  let prefix = "";

  prefixes.forEach((element) => {
    if (message.content.toLowerCase().indexOf(element.toLowerCase()) === 0) prefix = element;
  });
  
  if (prefix == "") return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  this.vlog("command > `" + cmd + "` > " + args.length + " arguments" + (args.length > 0 ? " > " + args.join(" | ") : ""));

  message.cmd = cmd;
  message.args = {};
  message.uargs = [...args];
  
  let command = this.commands.get(cmd) || this.commands.getFromAlias(cmd);
  if (command) {

    let auth = require("../main/authenticator.js").run.call(this, command, message);
    if (auth === -1) return;
  
    let parser = require("../main/parser.js").run.call(this, command, message);
    if (parser === -1) return;

    if (message.uargs.length > 0) {
      let desc = "";

      for (let x in message.args) desc += x + ": " + message.args[x] + " | ";

      this.vlog("command > `" + cmd + "` > args parsed > " + desc.slice(0, -3));
    }

    let cmdargs = [message];
    if (this.opts.clientArg) cmdargs.unshift(client);
    if (this.opts.argsArg) cmdargs.push(message.args);
    else command.run.call(this, ...cmdargs);
  }
  else {
    this.log("command > `" + cmd + "` not found");
  }

  //require("../main/postcmd.js").run.call(this, message);
}