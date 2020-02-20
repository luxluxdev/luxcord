exports.parseOptions = function (opts) {
  let options = {
    filter: msg => true,
    title: "Questionnaire",
    first: "q0",
    back: true,
    skip: false,
    exit: false,
    timeout: 600000,
    questions: [],

    ...opts // user overrides defaults
  };

  // loop parse questions
  options.questions.forEach((question, i) => {
    let next = options.questions[i+1] || undefined;
    let nextid = next ? (typeof next == "string" ? `q${i+1}` : next.id) : "end";

    // shortcut string question
    if (typeof question == "string") {
      question = {
        id: `q${i}`,
        type: "normal",
        text: question,
        goto: nextid
      }
    }

    // default values if they're undefined
    question = {
      id: `q${i}`,
      type: "normal",
      goto: nextid,

      ...question // override if defined
    }

    // normal questions
    if (question.type === "normal") {
      question = {
        text: question.text || `Question ${id}`,
        ...question
      }
    }

    // select questions
    if (question.type == "select") {
      if (!question.options || !Array.isArray(question.options)) question.options = [];

      question.options.forEach((s, i) => {
        switch(typeof s) {
          case "string": return s = {
            selection: `${i+1}`,
            text: s || `Selection ${i+1}`,
            goto: nextid
          };
          case "object": return {
            selection: `${i+1}`,
            text: `Selection ${i+1}`,
            goto: nextid,

            ...s // override
          };
        }
      });

      question = {
        text: question.text || `Question ${id}`,
        ...question
      }
    }

    // react questions
    if (question.type == "react") {
      if (!question.options || !Array.isArray(question.options)) question.options = [];

      question.options.forEach((s, i) => {
        switch(typeof s) {
          case "string": return s = {
            emoji: `${i+1}`,
            text: s || `Reaction ${i+1}`,
            goto: nextid
          };
          case "object": return {
            emoji: `${i+1}`,
            text: `Reaction ${i+1}`,
            goto: nextid,

            ...s // override
          };
        }
      });

      question = {
        text: question.text || `Question ${id}`,
        ...question
      }
    }

    options.questions[i] = question;
  });

  // recheck first
  let q0 = options.questions.find(q => q.first == options.first);
  if (!q0) q0 = options.questions[0].id;

  return options;
}