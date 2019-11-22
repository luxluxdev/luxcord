exports.run = function (message) {
  let embeds = message.embeds.reduce((a,b) => a + "[embed: " + (b.title || b.author.name || b.description) + "]", "");
  this.log("message received from " + message.author.tag + ": " + message.content + embeds);
  
  if (!this.opts.allowBots && message.author.bot) return this.log("message is from bot")
  if (message.author.id == this.user.id) return this.log("message is from self");
  
  if (message.content === this.opts.masterPrefix + "ping") message.reply("pong!");
}