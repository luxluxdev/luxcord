const Discord  = require("discord.js");
const client   = new Discord.Client();
client.Discord = Discord;

function init(opts) { require("./luxcord/init.js").run(client, opts); }

function about() { console.log("luxcord is a simple discord.js framework"); }

module.exports = {
  client: client,
  login: init,
  about: about
}