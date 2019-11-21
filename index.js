const Discord  = require("discord.js");
const client   = new Discord.Client();
client.Discord = Discord;

exports.login = (opts) => require("./luxcord/login.js").run(client, opts);

exports.about = () => console.log("luxcord is a simple discord.js wrapper");