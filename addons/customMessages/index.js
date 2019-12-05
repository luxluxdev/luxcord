exports.run = function () {
  this.cmd(
    {
      name: "say",
      args: {
        text: "string+"
      },
      desc: "Make me say something!"
    },

    function (message) {
      message.channel.send(message.args.text);
    }
  );

  this.cmd(
    {
      name: "embed",
      args: {
        str: "string+"
      },
      desc: "Send a custom embed!\nstr: <title> | <desc> | <img url> | <footer>"
    },

    function (message) {
      let str = message.args.str;
      message.channel.embed(...str.split("|"));
    }
  );
}