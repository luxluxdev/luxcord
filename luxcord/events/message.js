const path = require("path");

exports.run = function (message) {
  if (message.channel.type === "dm" && !client.opts.allowDMs) return;

  let embeds = message.embeds.reduce((a,b) => a + "[embed: " + (b.title || b.author.name || b.description) + "]", "");
  this.vlog("message received from " + message.author.tag + ": " + message.content + embeds);

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

  this.vlog("command detected: `" + cmd + "` with " + args.length + " arguments");

  message.cmd = cmd;
  message.args = {};
  message.uargs = [...args];
  
  let command = this.commands.get(cmd) || this.commands.getFromAlias(cmd);
  if (command) {

    // TO-DO command authenticator
  
    require("../main/precmd.js").run.call(this, command, message);

    let cmdargs = [message];
    if (this.opts.clientArg) cmdargs.unshift(client);
    if (this.opts.argsArg) cmdargs.push(message.args);
    else command.run.call(this, ...cmdargs);
  }
  else {
    this.log("command `" + cmd + "` not found");
  }

  //require("../main/postcmd.js").run.call(this, message);
}