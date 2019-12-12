# Luxcord - An elegant discord.js framework

Designed with simplicity and flexibility in mind.

[npm][1] · [github][2] · [docs][3]

```
> npm i luxcord
```

## Luxcord in One Line

```js
require("luxcord").init({token: "..."}).cmd("ping", "pong");
```

## Luxcord in One File

```js
require("luxcord")

.init({
  prefix: ".",
  token: "super-secret-token"
})

.cmd("yin", function (message) {
  message.channel.send("yang");
})

.evt("guildMemberAdd", function (member) {
  member.send(`Welcome to ${member.guild.name}!`);
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

**· Command Module** `/cmd/cookie.js`:
```js
exports.opts = {
  name: "cookie",
  args: {
    amount: "number?",
    target: "member",
    reason: "string+"
  },
  aliases: ["gift", "cookies"]
}

exports.run = function (message) {
  let {amount, target, reason} = message.args;
  let sender = message.author;
  
  let cookies = (amount) ? (amount + " cookies") : ("a cookie");

  message.channel.embed("Cookie Gift!",
    `${target}, ${sender} gave you ${cookies} because ${reason}`);
}
```

**· Event Module** `/evt/channelCreate.js`:
```js
exports.run = function (channel) {
  if (channel.type !== "text") return;

  if (channel.name === this.opts.name)
    channel.send("A channel just for me? Awesome!");
  else
    channel.send("First! ;)");
}
```

## Reasons to Luxcord

  - **Elegance:** Syntax is flexible, short, and clean.
  - **Swiftness:** Write a bot in minutes, if not seconds.
  - **Simplicity:** As non-verbose as possible. Easy to read, easy to write. Straightforward for beginners and veterans alike.
  - **Automation:** Commands and Events automatically registered from scanned folders. Syntax automatically checked for and syntax help automatically provided when wrong syntax is used.
  - **Argument Parsing:** Numbers, integers, users, members, channels, roles, guilds. From mentions, IDs, names or even nicknames. Required and optional arguments supported. Parsed arguments are directly accessible from "message.args" in their respective object forms.
  - **Ranking:** Simple yet powerful ranking system for commands. Commands divided into groups for easy classification, depending on member roles, permissions or IDs.
  - **Optionally verbose:** Can be set to verbose mode, detailed logs in console, for easier debugging.
  - **Compatibility:** Underlying discord.js library completely exposed.
  - **Addons:** Powerful addons to perform powerful tasks, automatically. Eval command, help menus, custom messages and embeds, etc.
  - **Documentation:** [Work in progress!][3]

**Note:** Currently a work in progress! Project not fully complete yet. If you need help, contact me directly on Discord (luxluxdev#0299) or feel free to open an issue on github!

  [1]: https://npmjs.com/package/luxcord
  [2]: https://github.com/luxluxdev/luxcord
  [3]: https://luxlux.dev/luxcord/