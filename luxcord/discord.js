exports.run = (client) => {
  let Discord = client.Discord;
  
  client.log = str => { if (client.opts.verbose) console.log(client.opts.name + " > " + str); }
}