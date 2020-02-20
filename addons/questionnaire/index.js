exports.run = function () {
  this.questionnaire = (async function (channel, options) {
    // store answers
    let answers = {};

    // check and parse questions to have a standardized syntax
    options = require("./questionnaireParser.js").parseOptions(options);

    // keep track for next and previous questions
    last = options.first;
    next = options.first;
    abort = this.opts.maxQuestions;

    // store values for the display embed
    values = [options.title || "Questionnaire"];

    let message = await channel.embed();

    while (next && next != "end" && next != "exit") {
      // prevent infinite loops
      abort--; if (abort <= 0) break;

      let question = options.questions.find(q => q.id == next);
      if (!question) break; // no question found, break loop

      // ask question and get answer
      let a = await require("./asker.js").ask.call(this, question, options, message, values, next);

      answers[question.id] = a[0];
      values = a[1];
      next = a[2];

      // check if go back
      if (answers[question.id] == "luxcord.questionnaire.goBack") {
        delete answers[question.id];
        next = last;
      }
      
      // mark this question as last
      last = question.id;
    }

    // delete embed
    await message.delete();

    // return answers
    return answers;
  }).bind(this);
}