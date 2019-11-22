exports.run = function (message) {
  if (message.author.bot || message.author.id == this.user.id) return;
  
  this.log("message received from " + message.author.tag + ": " + message.content);
  
  /*
  let prefix = "";
  
  prefixes.forEach((element) => {
    if (message.content.toLowerCase().indexOf(element.toLowerCase()) === 0) prefix = element;
  });
  
  if (prefix == "") return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (!require("./cmdauth.js").auth(message, cmd)) return;
  
  require("../cmd/" + cmd + ".js").run(this, message, args);*/
}