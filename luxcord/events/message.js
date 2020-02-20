const path = require("path");

exports.run = function (message) {
  if (message.channel.type === "dm" && !this.opts.allowDMs) return;

  // vlog message
  let embeddesc = b => b.title || (b.author && b.author.name) || b.description || (b.fields && b.fields[0] && (b.fields[0].name || b.fields[0].value)) || "(...)";
  let content = message.content ? `\n${message.content}` : "";
  let embeds = message.embeds.reduce((a,b) => `${a}\n[embed: ${embeddesc(b)}]`, "");
  this.vlog("message", `${message.author.tag} (${message.author.id}) at ${message.guild.name} in #${message.channel.name} ${content}${embeds}`);
  
  // deny bots and self if needed
  if (!this.opts.allowBots && message.author.bot) return;
  if (message.author.id == this.user.id) return;

  // load prefixes
  let prefixes = [];
  if (this.opts.mentionPrefix) prefixes.push(this.user.toString());
  if (this.opts.hardcodedPrefixes) {
    prefixes.push(this.opts.prefix, ...this.opts.prefixes);
  }
  
  // if no loaded prefixes, default to "luxcord."
  if (prefixes.length == 0) prefixes = ["luxcord."];

  // figure out the prefix used
  let prefix = "";

  prefixes.forEach((element) => {
    if (message.content.toLowerCase().indexOf(element.toLowerCase()) === 0) prefix = element;
  });
  
  if (prefix == "") return;
  
  // get cmd and separate args
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (args.length > 0)
    this.vlog("command", cmd, `${args.length} arguments`, args.join(" | "));
  else
    this.vlog("command", cmd, `${args.length} arguments`);

  message.prefix = prefix;
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

      for (let x in message.args) desc += `${x}: ${message.args[x]} | `;

      this.vlog("command", cmd, "args parsed", desc.slice(0, -3));
    }

    // arguments
    let cmdargs = [message];

    // add optional client and args arguments, if specified via opts, (client, message, args)
    if (this.opts.clientArg) cmdargs.unshift(client);
    if (this.opts.argsArg) cmdargs.push(message.args);

    // run
    try {
      command.run.call(this, ...cmdargs);
    } catch (err) {
      this.log("command", cmd, "UNHANDLED EXCEPTION", "logging stack trace...");
      console.log("\n----- ERROR STACK TRACE START -----------------------------------------\n");
      console.error(err);
      console.log("\n----- ERROR STACK TRACE END   -----------------------------------------\n");
    }
  }
  else {
    this.log("command", cmd, "not found");
  }
}