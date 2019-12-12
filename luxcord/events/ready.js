exports.run = function () {
  let owner = this.opts.ownerID ? this.users.get(this.opts.ownerID) : undefined;

  this.vlog("---------------------------------------------------");
   this.log("successful login                                   ");
  this.vlog("---------------------------------------------------");
  this.vlog("usertag:   " + this.user.tag);
  this.vlog("id:        " + this.user.id);
  this.vlog("owner:     " + (owner ? owner.tag : "none"));
  this.vlog("prefix:    " + this.opts.prefix);
  this.vlog("guilds:    " + this.guilds.size);
  this.vlog("users:     " + this.users.size);
  this.vlog("dirname:   " + this.opts.rootdir);
  this.vlog("---------------------------------------------------");
  this.vlog(`powered by luxcord v${this.luxcordVersion}         `);
  this.vlog("---------------------------------------------------");
}