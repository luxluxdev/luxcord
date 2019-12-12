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
        embed: "string+"
      },
      desc: "Send a custom embed!\nembed: [title] | [desc] | [img url] | [footer]"
    },

    function (message) {
      let embed = message.args.embed;
      message.channel.embed(...embed.split("|"));
    }
  );
}