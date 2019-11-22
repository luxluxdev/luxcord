const path = require("path");

exports.run = function (message) {
  let embeds = message.embeds.reduce((a,b) => a + "[embed: " + (b.title || b.author.name || b.description) + "]", "");
  this.log("message received from " + message.author.tag + ": " + message.content + embeds);

  // TO-DO message preprocessor
  
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

  this.log("command detected: `" + cmd + "` with " + args.length + " arguments");

  message.args = args;

  // TO-DO command authenticator

  // TO-DO command preprocessor
  
  let command = this.commands.get(cmd) || this.commands.getFromAlias(cmd);
  if (command) {
    let cmdargs = [message];
    if (this.opts.clientArg) cmdargs.unshift(client);
    if (this.opts.argsArg) cmdargs.push(args);
    else command.run.call(this, ...cmdargs);
  }
  else console.log("command `" + cmd + "` not found");

  // TO-DO command postprocessor
}