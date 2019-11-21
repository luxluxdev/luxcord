exports.run = (client) => {
  let Discord = client.Discord;
  
  client.log = str => console.log(client.opts.name + " > " + str);
}