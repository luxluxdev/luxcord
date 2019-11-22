# Luxcord - An elegant discord.js framework

Luxcord is an elegant framework for discord.js.

Designed with simplicity and flexibility in mind.

It is currently a work in progress. **Not ready for use just yet.**

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

**Entry Point** `/app.js`:
```js
const luxcord = require("luxcord");

let opts = {
  name: "my-amazing-bot",
  prefix: ".",
  token: "super-secret-token",
  verbose: true
}

luxcord.init(opts);
```

**Command Module** `/cmd/gift.js`:
```js
exports.opts = {
  name: "gift",
  args: {
    target: "member-optional",
    gift: "string-join"
  },
  desc: "Gift someone something!",
  subs: ["member"]
}

exports.run = function (message) {
  let args = message.args;
  
  if (args.target.id === message.author.id) return message.channel.embed("Error", "You gifted yourself " + args.gift + "...");
  if (args.target.id === this.user.id) return message.channel.embed("Thank you!", "I appreciate it :)");

  return message.channel.embed("Gift!", "" + message.author + " gifted " + args.target + " " + args.gift + "!");
}
```

**Event Module** `/evt/channelCreate.js`:
```js
exports.run = function (channel) {
  if (channel.type !== "text") return;

  if (channel.name === this.opts.name) return channel.send("A channel just for me? That's amazing!");
  else channel.send("First! ;)");
}
```