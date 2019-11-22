exports.run = function () {
  this.embed = (title, description, image, footer, timestamp, thumbnail) => {
    return {embed: {
      title: title,
      description: description,
      image: {url: image},
      footer: {text: footer},
      timestamp: timestamp,
      thumbnail: {url: thumbnail},
      color: this.opts.color
    }}
  }
  
  // template embed promise function
  const embed = function (title, description, image, footer, timestamp, thumbnail) {
    return new Promise((resolve, reject) => {
      this.send(this.embed(title, description, image, footer, timestamp, thumbnail))
      .then(msg => resolve(msg))
      .catch(err => reject(err));
    })
  }
  
  const protoembed = object => object.prototype.embed = embed;
  
  const discordobjects = [
    Discord.TextChannel,
    Discord.DMChannel,
    Discord.User,
    Discord.GuildMember
  ];
  
  discordobjects.forEach(x => protoembed(x));
  
  Discord.Message.prototype.syntax = function (syntax = null) {
    return this.channel.embed("Syntax Error", "Correct Usage: `" + syntax + "`");
  }
}