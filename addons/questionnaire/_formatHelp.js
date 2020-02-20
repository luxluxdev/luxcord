// questionnaire options format help

let options = {
  filter: msg => msg.author.id == message.author.id, // filter to be used when collecting messages
  first: "q0",      // first question, default `q0`
  back: true,       // enable back button (reaction)
  skip: false,      // enable skip button (reaction)
  exit: false,      // enable exit button (reaction)
  timeout: 600000,  // time in ms before question defaults answer to "-"
  questions: [
    // NORMAL QUESTION
    {
      id: "q0", // default `q${index}`
      type: "normal", // default `normal`
      text: "What type of music do you listen to?", // default `Question ${id}`
      goto: "q1" // default next question
    },

    // SELECT QUESTION
    {
      id: "q1",
      type: "select",
      text: "What kind of phone do you use?",
      options: [
        {
          selection: "1", // default `${index+1}`
          text: "Android", // default `Selection ${selection}`
          goto: "q2" // default next question
        },
        {
          selection: "2",
          text: "iPhone",
          goto: "q3"
        },
        {
          selection: "3",
          text: "Other"
        }
      ]
    },

    // REACT QUESTION
    {
      id: "q2",
      type: "react",
      text: "Pineapple on pizza?",
      options: [
        {
          emoji: "thinking", // automatically detects if custom or not, default `0-10`
          text: "No wtf?", // default `${emoji}`
        },
        {
          emoji: "kannaSip",
          text: "Yes!",
          goto: "q2" // Creates a potentially infinite loop
        },
        {
          emoji: "cross",
          text: "Exit questionnaire",
          goto: "end" // use `end` or `exit` on goto to end a questionnaire early
        }
      ]
    }
  ]
}