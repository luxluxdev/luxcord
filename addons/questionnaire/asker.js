exports.ask = async function (question, options, message, values, next) {
  // global
  let i = 0; // values iterator
  let embed = new this.Discord.RichEmbed().setTitle(values[i++]);
  next = question.goto;

  // add already asked and/or answered questions to embed
  while (i < values.length) embed.addField(values[i++] || "", values[i++] || "");
  await message.edit(embed);

  let answer = "-";

  // normal question
  if (question.type == "normal") {
    let msg = await message.channel.embed(question.text, null, null, "Answer on your next message");

    // wait for an answer from the author
    try {
      let collection = await message.channel.awaitMessages(
        msg => msg.content && options.filter(msg),
        { maxMatches: 1, time: 600000, errors: ["time"] }
      );

      answer = collection.first().content || "--";
      await collection.first().delete();
    } catch (e) {
      // do nothing if error
    }

    values.push(question.text, answer);
    await msg.delete();
  }
  
  // global
  return [answer, values, next];
}