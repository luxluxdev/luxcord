exports.run = function (command, message) {
  parseArgs(message, command);
}

function parseArgs(message, command) {
  parsed = [];
}

/*

arg options:

none

any
  -optional

string
  -join

number
  -positive

user/member
  -mention
  -name
  -tag
  -id

channel
  -mention
  -name
  -id
  -category

guild
  -name
  -id

role
  -mention
  -name
  -id

*/