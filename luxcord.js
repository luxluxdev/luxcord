const Discord  = require("discord.js");
const client   = new Discord.Client();
client.Discord = Discord;

client.init = function (opts) { return require("./luxcord/init.js").Luxcord.call(client, opts); }

module.exports = client;