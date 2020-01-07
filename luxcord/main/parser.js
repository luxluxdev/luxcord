exports.run = function (command, message) {
  let types = {...command.opts.args} || {};
  let typeArray = [];

  // organize into array, separate optional tag
  for (let t in types) {
    let optional = types[t].endsWith("?");

    typeArray.push({
      name: t,
      value: optional ? types[t].slice(0, -1) : types[t],
      optional: optional
    });

    types[t] = optional ? types[t].slice(0, -1) : types[t];
  }

  // count number of required arguments
  let nRequired = typeArray.reduce((a, b) => a + (b.optional ? 0 : 1), 0);

  if (message.uargs.length < nRequired) return message.syntax(command.opts.name);

  let adjusted;

  if (message.uargs.length < typeArray.length) {
    adjusted = {};

    // max number of optionals to take = received arguments - required arguments
    optionalsRemaining = message.uargs.length - nRequired;
    for (let t of typeArray) {
      if (t.optional) {
        if (optionalsRemaining > 0) {
          optionalsRemaining--;
          adjusted[t.name] = t.value;
        }
      } else {
        adjusted[t.name] = t.value;
      }
    }
  }
  
  parseArgs.call(this, message, adjusted || types);
}

function parseArgs(message, types) {
  let uargs = [...message.uargs];
  
  let nameArray = Object.keys(types);
  let typeArray = Object.values(types);

  message.args = {};

  let i = 0;

  // loop forwards and parse until string+
  while (true) {
    if (uargs.length == 0) return; // check end

    let type = typeArray[i];

    if (type === "string+") break;

    message.args[nameArray[i]] = parse.call(this, uargs.shift(), type, message);
  
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
  if (!a.includes(type)) return str;

  // any string number int
  switch (type) {
    case "any": return str;
    case "string": return str;
    case "number": return +str || Number(str) || parseFloat(str) || undefined;
    case "int": return parseInt(str) || undefined;
  }

  // user
  if (type === "user") {
    if (/^<@[0-9]+>$/.test(str)) str = str.slice(2, -1);
    if (/^<@[^0-9]?[0-9]+>$/.test(str)) str = str.slice(3, -1);

    let users = this.users;

    return findBy(users, str, "id") ||
           findBy(users, str, "username") ||
           findBy(users, str, "tag") ||
           undefined;
  }

  // member
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

  // channel
  if (type === "channel") {
    if (/^<#([0-9]+)>$/.test(str)) str = str.slice(2, -1);
    if (/^<@[^0-9]?[0-9]+>$/.test(str)) str = str.slice(3, -1);

    let guildtxtch = message.guild.channels.filter(ch => ch.type == "text");
    let guildch = message.guild.channels;
    let allch = this.channels;

    return findBy(allch, str, "id") ||
           findBy(guildtxtch, str, "name") ||
           findBy(guildch, str, "name") ||
           undefined;
  }

  // role
  if (type === "role") {
    if (/^<#([0-9]+)>$/.test(str)) str = str.slice(2, -1);
    if (/^<@[^0-9]?[0-9]+>$/.test(str)) str = str.slice(3, -1);

    let roles = message.guild.roles;

    return findBy(roles, str, "id") ||
           findBy(roles, str, "name") ||
           undefined;
  }

  // guild
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