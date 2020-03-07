exports.run = function () {
  let mod = {};

  mod.warn = function (member, reason) {

  }

  mod.kick = function (member, reason) {
    member.kick(reason);
  }

  mod.ban = function (member, reason) {
    member.ban(reason);
  }

  mod.mute = function (member, time, reason) {

  }

  this.mod = mod;

  require("./tick.js").run.call(this);
}