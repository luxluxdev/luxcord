# Luxcord - A simple discord.js framework

Luxcord is a simple yet flexible framework for discord.js!

It is currently a work in progress. Not ready for use.

**Example - How this package will end up being used**

Example entry `/app/bot.js`:
```js
const luxcord = require("luxcord");

let opts = {
  name: "my-amazing-bot",
  token: "jhc6hjA568d3g.grMzE1ODQ.6Xd3cBQk77kINERgcO7u7vi3k.JiPCl9o0o",
  ownerID: "177044577042169856",
  verbose: false,
  allowBots: false,
  masterPrefix: ".",
  cmdDirectory: "./cmd",
  evtDirectory: "./evt",
  cfgDirectory: "./cfg",
  color: 0xff99ee
}

luxcord.init(opts);
```

Example command `/app/cmd/gift.js`:
```js
exports.run = function (message) {
  let args = message.validate({target: "member-optional", gift: "string-join"}); if (!args) return;
  
  if (args.target.id === message.author.id) return message.channel.embed("Error", "You gifted yourself " + args.gift + "...");
  if (args.target.id === this.user.id) return message.channel.embed("Thank you!", "I appreciate it :)");

  return message.channel.embed("Gift!", "" + message.author + " gifted " + args.target + " " + args.gift + "!");
}
```

Example event `/app/evt/channelCreate.js`:
```js
exports.run = function (channel) {
  if (channel.type !== "text") return;

  if (channel.name === this.opts.name) return channel.send("A channel just for me? That's amazing!");
  else channel.send("First! ;)");
}
```