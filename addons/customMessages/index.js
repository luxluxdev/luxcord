exports.run = function () {
  this.cmd(
    {
      name: "say",
      args: {
        text: "string+"
      },
      desc: "Send a custom message!",
      example: "beep boop"
    },

    function (message) {
      message.channel.send(message.args.text);
    }
  );

  this.cmd(
    {
      name: "saych",
      args: {
        channel: "channel",
        text: "string+"
      },
      desc: "Send a custom message to a channel!",
      example: "#general beep boop"
    },

    function (message) {
      message.args.channel.send(message.args.text);
    }
  );

  this.cmd(
    {
      name: "embed",
      args: {
        embed: "string+"
      },
      desc: "Send a custom embed!\nembed: [title] | [desc] | [img url] | [footer]",
      example: "Welcome! | Enjoy your stay :) | | At your service!"
    },

    function (message) {
      let embed = message.args.embed;
      message.channel.embed(...embed.split("|"));
    }
  );

  this.cmd(
    {
      name: "embedch",
      args: {
        channel: "channel",
        embed: "string+"
      },
      desc: "Send a custom embed to a channel!\nembed: [title] | [desc] | [img url] | [footer]",
      example: "#general Welcome! | Enjoy your stay :) | | <3"
    },

    function (message) {
      let embed = message.args.embed;
      message.args.channel.embed(...embed.split("|"));
    }
  );
}