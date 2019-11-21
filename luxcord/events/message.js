exports.run = function (message) {
  this.log("message received from " + message.author.tag + ": " + message.content);
}