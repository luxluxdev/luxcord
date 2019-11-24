# Luxcord - An elegant discord.js framework

Designed with simplicity and flexibility in mind.

[npm][1] · [github][2]

```
> npm i luxcord
```

## Luxcord in One Line

```js
require("luxcord").init({token: "..."}).cmd("ping", msg => msg.reply("pong"));
```

## Luxcord in One File

```js
require("luxcord")

.init({
  prefix: ".",
  token: "super-secret-token"
})

.cmd("yin", function(message) {
  message.channel.send("yang");
})

.evt("guildMemberAdd", function(member) {
  member.send("Welcome to our server!");
})
```

## Luxcord in Modules

**· Entry Point** `/app.js`:
```js
const luxcord = require("luxcord");

let opts = {
  prefix: ".",
  token: "super-secret-token"
}

luxcord.init(opts);
```

**· Command Module** `/cmd/gift.js`:
```js
exports.opts = {
  name: "gift",
  args: {
    target: "member-mention",
    gift: "string-join"
  },
  aliases: ["give", "present"]
}

exports.run = function (message) {
  let args = message.args;
  
  if (args.target.id === message.author.id) return message.channel.embed("Error", "You gifted yourself " + args.gift + "...");
  if (args.target.id === this.user.id) return message.channel.embed("Thank you!", "I appreciate it :)");

  return message.channel.embed("Gift!", "" + message.author + " gifted " + args.target + " " + args.gift + "!");
}
```

**· Event Module** `/evt/channelCreate.js`:
```js
exports.run = function (channel) {
  if (channel.type !== "text") return;

  if (channel.name === this.opts.name) return channel.send("A channel just for me? That's amazing!");
  else channel.send("First! ;)");
}
```

Currently a work in progress. **Not ready for public use just yet.**

  [1]: https://npmjs.com/package/luxcord
  [2]: https://github.com/luxluxdev/luxcord