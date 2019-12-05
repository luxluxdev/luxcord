exports.run = function (command, message) {
  if (!this.cmdAuth) return;
  if (this.opts.ownerID == message.author.id) return;

  let subs = this.cmdAuth.subs || {};
  let ranks = this.cmdAuth.ranks || {};

  let cmdsub = "defaultmember";
  let usersubs = ["defaultmember"]

  // get sub containing command
  for (let sub in subs) {
    if (subs[sub].includes(command.opts.name)) {
      cmdsub = sub;
      break;
    }
  }

  // get subs from ranks the member is in
  for (let rank in ranks) {
    if (userHasRank(message, ranks[rank])) {
      usersubs = [...usersubs, ...ranks[rank].subs];
    }
  }

  // check if sub is in subs
  if (usersubs.includes(cmdsub)) {
    return;
  } else {
    return message.autherr(cmdsub);
  }
}

function userHasRank(message, rank) {
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