exports.opts = 

exports.run = function () {
  this.cmd(
    {
      name: "eval",
      args: {
        code: "string+"
      }
    },
    
    function (message) {
      if (message.author.id !== this.opts.ownerID) return message.autherr();

      let evaled = eval(message.args.code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), {code:"xl"});
    }
  );
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}