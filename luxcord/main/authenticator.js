exports.run = function (command, message) {
  if (this.opts.ownerID == message.author.id && this.opts.ownerBypassAuth) return;

  // check if useCmdAuth is enabled and db exists
  if (!this.opts.useCmdAuth) return;
  if (!this.db) return;

  // get global ranks unless perServerRanks is true and db exists
  const ranks = (this.opts.perServerRanks &&
    this.db("cmdAuth", "server", message.guild.id).get("ranks").value()) ||
    this.db("cmdAuth", "global").get("ranks").value();

  let cmdRanks = [];
  let userRanks = [];

  // get ranks including command and user
  for (let rank of ranks) {
    if (rank.commands && rank.commands.includes(command.opts.name))
      cmdRanks.push(rank.name);

    if (userHasRank(message, rank))
      userRanks.push(rank.name, ...(rank.inherit || []));
  }

  // check for nested inherits
  if (this.opts.checkNestedInherits) {
    (function findNestedInherits() {
      let update = []; // nested inherits to later add to userRanks
  
      // for each userRank
      for (let name of userRanks) {
        let rank = ranks.find(x => x.name == name);
        if (!rank) continue;
  
        // for each inherited rank of userRank
        for (let inherited of rank.inherit || []) {
          let inheritedRank = ranks.find(x => x.name == inherited);
          if (!inheritedRank) continue;
  
          // check if nested should be added to update
          for (let nested of inheritedRank.inherit || []) {
            if (!userRanks.includes(nested) && !update.includes(nested)) {
              update.push(nested);
            }
          }
        }
      }
  
      // recursive
      if (update.length > 0) {
        userRanks.push(...update);
        findNestedInherits.call(this);
      }
    }).call(this)
  }

  // if no rank has command, return
  if (cmdRanks.length == 0) return;

  // check if one of userRanks is one of cmdRanks
  if (cmdRanks.some(x => userRanks.includes(x)))
    return; // user has auth
  else
    return message.autherr(cmdRanks); // user doesn't have auth
}

function userHasRank(message, rank) {
  let user = message.author;
  let member = message.member;

  return getRankBypassers(rank, "u").includes(user.id) ? true :
         getRankBypassers(rank, "t").includes(user.tag) ? true :
         getRankBypassers(rank, "r").some(r => member.roles.has(r)) ? true :
         getRankBypassers(rank, "n").some(n => member.roles.array().map(r => r.name).includes(n)) ? true :
         getRankBypassers(rank, "p").some(p => member.hasPermission(p)) ? true :
         false;
}

function getRankBypassers(rank, t) {
  // t (type) being the letter in front of the bypass element
  // e.g. "u" in "u.177044577042169856"
  return rank.bypass ? rank.bypass.filter(x => x.startsWith(`${t}.`)).map(x => x.slice(2)) : [];
}