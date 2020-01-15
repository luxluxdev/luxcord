exports.run = function (command, message) {
  if (this.opts.ownerID == message.author.id && this.opts.ownerBypassAuth) return;

  let defaultRankName = this.opts.defaultRankName;

  const auth = this.cfgdb.get("cmdAuth").value();
  if (!auth) return;

  let subs = auth.subs || {};

  let ranks = {
    ...(this.opts.globalRanks ? auth.global : {}),
    ...(this.opts.perServerRanks ? auth[message.guild.id] : {})
    // note that server ranks will override their global counterparts if names match
  }

  let cmdsubs = [];
  let usersubs = [defaultRankName];

  // get subs containing command
  for (let sub in subs) {
    if (subs[sub].includes(command.opts.name)) {
      cmdsubs.push(sub);
    }
  }

  // if no subs found, default to defaultRankName
  if (cmdsubs.length == 0) cmdsubs = [defaultRankName];

  // get subs from ranks the member is in
  for (let rank in ranks) {
    if (userHasRank.call(this, message, ranks[rank], rank)) {
      usersubs.push(...ranks[rank].subs);
    }
  }

  // check if usersubs has at least one of the subs
  if (cmdsubs.some(x => usersubs.includes(x))) {
    return;
  } else {
    return message.autherr(cmdsubs);
  }
}

function userHasRank(message, rank, rankName) {
  let user = message.author;
  let member = message.member;
  
  if (rank.userids) if (rank.userids.includes(user.id)) return true;

  if (member) {
    if (rank.perms) if (rank.perms.some(p => member.hasPermission(p))) return true;
    if (rank.roleids) if (member.roles.array().map(r => r.id).some(id => rank.roleids.includes(id))) return true;
    if (rank.rolenames) if (member.roles.array().map(r => r.name).some(name => rank.rolenames.includes(name))) return true;
  }

  return false;
}