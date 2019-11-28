const path = require("path");

exports.run = function (message) {
  if (message.channel.type === "dm" && !client.opts.allowDMs) return;

  // vlog message
  let embeds = message.embeds.reduce((a,b) => a + "\n[embed: " + (b.title || b.author.name || b.description) + "]", "");
  this.vlog("message > " + message.author.tag + " at " + message.guild.name + " in #" + message.channel.name + (message.content.length > 0 ? "\n" + message.content : "") + embeds);
  
  // deny bots and self if needed
  if (!this.opts.allowBots && message.author.bot) return;
  if (message.author.id == this.user.id) return;

  // TO-DO per-server prefixes!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // figure out the prefix used
  let prefixes = [this.user.toString(), this.opts.prefix];
  let prefix = "";

  prefixes.forEach((element) => {
    if (message.content.toLowerCase().indexOf(element.toLowerCase()) === 0) prefix = element;
  });
  
  if (prefix == "") return;
  
  // get cmd and separate args
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  this.vlog("command > `" + cmd + "` > " + args.length + " arguments" + (args.length > 0 ? " > " + args.join(" | ") : ""));

  message.cmd = cmd;
  message.args = {};
  message.uargs = [...args];
  
  // get command object and run
  let command = this.commands.get(cmd) || this.commands.getFromAlias(cmd);
  if (command) {

    // authenticate user
    let auth = require("../main/authenticator.js").run.call(this, command, message);
    if (auth === -1) return; // message.autherr()
  
    // parse args
    let parser = require("../main/parser.js").run.call(this, command, message);
    if (parser === -1) return; // message.syntax()

    // log args and parsed args
    if (message.uargs.length > 0) {
      let desc = "";

      for (let x in message.args) desc += x + ": " + message.args[x] + " | ";

      this.vlog("command > `" + cmd + "` > args parsed > " + desc.slice(0, -3));
    }

    // arguments
    let cmdargs = [message];

    // add optional client and args arguments, if specified via opts
    if (this.opts.clientArg) cmdargs.unshift(client);
    if (this.opts.argsArg) cmdargs.push(message.args);

    // run
    else command.run.call(this, ...cmdargs);
  }
  else {
    this.log("command > `" + cmd + "` not found");
  }
}