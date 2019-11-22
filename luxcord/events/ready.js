exports.run = function () {
  this.log("---------------------------------------------------");
  console.log(this.opts.name + " > successful login");
  this.log("---------------------------------------------------");
  this.log("usertag:   " + this.user.tag);
  this.log("id:        " + this.user.id);
  this.log("owner:     " + (this.opts.ownerID ? this.users.get(this.opts.ownerID).tag : "none"));
  this.log("guilds:    " + this.guilds.size);
  this.log("users:     " + this.users.size);
  this.log("__dirname: " + __dirname);
  this.log("---------------------------------------------------");
}