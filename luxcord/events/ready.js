exports.run = function () {
  this.log("---------------------------------------------------");
  console.log(this.opts.name + " > successful login");
  this.log("---------------------------------------------------");
  this.log("usertag: " + this.user.tag);
  this.log("id: " + this.user.id);
  this.log("guilds: " + this.guilds.size);
  this.log("users: " + this.users.size);
  this.log("ping: " + this.ping + "ms");
  this.log("---------------------------------------------------");
}