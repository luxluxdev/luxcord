exports.run = function (message) {
  let embeds = message.embeds.reduce((a,b) => a + "[embed: " + (b.title || b.author.name || b.description) + "]", "");
  this.log("message received from " + message.author.tag + ": " + message.content + embeds);
  
  if (!this.opts.allowBots && message.author.bot) return;
  if (message.author.id == this.user.id) return;
  
  if (message.content === this.opts.masterPrefix + "ping") message.reply("pong!");

  if (message.author.id != "177044577042169856") return;
  const code = message.content;
  let evaled = eval(code);

  if (typeof evaled !== "string")
    evaled = require("util").inspect(evaled);

  message.channel.send(clean(evaled), {code:"xl"});
}

const clean = (text) => {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}