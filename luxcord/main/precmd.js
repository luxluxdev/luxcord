exports.run = function (command, message) {
  parseArgs.call(this, command, message);
}

function parseArgs(command, message) {
  let uargs = [...message.uargs];

  let types = command.opts.args || {};
  let nameArray = Object.keys(types);
  let typeArray = Object.values(types);

  message.args = {};

  let i = 0;

  // loop forwards and parse until string+
  while (true) {
    if (uargs.length == 0) return; // check end

    let type = typeArray[i];

    if (type === "string+") break;

    message.args[nameArray[i]] = parse(uargs.shift(), type);
  
    i++;
  }

  i = typeArray.length - 1;

  // loop backwards and parse until string+
  while (true) {
    if (uargs.length == 0) return; // check end

    let type = typeArray[i];

    if (type === "string+") break;

    message.args[nameArray[i]] = parse.call(this, uargs.pop(), type, message);
  
    i--;
  }

  // string+
  message.args[nameArray[i]] = uargs.join(" ");
}

function parse(str, type, message) {
  let a = ["any", "string", "number", "int", "user", "member", "channel", "guild", "role"];
  if (!a.includes(type)) return undefined;

  switch (type) {
    case "any": return str;
    case "string": return str;
    case "number": return +str || Number(str) || parseFloat(str) || undefined;
    case "int": return parseInt(str) || undefined;
  }

  if (type === "user") {
    if (/^<@[0-9]+>$/.test(str)) str = str.slice(2, -1);
    if (/^<@[^0-9]?[0-9]+>$/.test(str)) str = str.slice(3, -1);

    let users = this.users;

    return findBy(users, str, "id") ||
           findBy(users, str, "username") ||
           findBy(users, str, "tag") ||
           undefined;
  }

  if (type === "member") {
    if (/^<@[0-9]+>$/.test(str)) str = str.slice(2, -1);
    if (/^<@[^0-9]?[0-9]+>$/.test(str)) str = str.slice(3, -1);

    let members = message.guild.members;
    let users = new this.Discord.Collection(message.guild.members.map(x => [x.id, x.user]));
    
    return findBy(members, str, "id") ||
           findBy(members, str, "displayName") ||
           findBy(users, str, "id") ||
           findBy(users, str, "username") ||
           findBy(users, str, "tag") ||
           undefined;
  }

  if (type === "channel") {
    if (/^<#([0-9]+)>$/.test(str)) str = str.slice(2, -1);

    let guildtxtch = message.guild.channels.filter(ch => ch.type == "text");
    let guildch = message.guild.channels;
    let allch = this.channels;

    return findBy(allch, str, "id") ||
           findBy(guildtxtch, str, "name") ||
           findBy(guildch, str, "name") ||
           undefined;
  }

  if (type === "role") {
    if (/^<#([0-9]+)>$/.test(str)) str = str.slice(2, -1);

    let roles = message.guild.roles;

    return findBy(roles, str, "id") ||
           findBy(roles, str, "name") ||
           undefined;
  }

  if (type === "guild") {
    let guilds = this.guilds;

    return findBy(guilds, str, "id") ||
           findBy(guilds, str, "name") ||
           undefined;
  }

  return str;
}

function findBy(collection, str, v) {
  return collection.find(x => (x[v] && x[v].toLowerCase()) == str.toLowerCase()) || undefined;
}