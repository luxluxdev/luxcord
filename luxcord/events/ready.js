exports.run = function () {
  this.vlog("---------------------------------------------------");
  this.log(this.opts.name + " > successful login               ");
  this.vlog("---------------------------------------------------");
  this.vlog("usertag:   " + this.user.tag);
  this.vlog("id:        " + this.user.id);
  this.vlog("owner:     " + (this.opts.ownerID ? this.users.get(this.opts.ownerID).tag : "none"));
  this.vlog("guilds:    " + this.guilds.size);
  this.vlog("users:     " + this.users.size);
  this.vlog("dirname:   " + __dirname);
  this.vlog("---------------------------------------------------");
  this.vlog("powered by luxcord                                 ");
  this.vlog("---------------------------------------------------");
}