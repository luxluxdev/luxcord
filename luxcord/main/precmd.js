exports.run = function (command, message) {
  parseArgs(command, message);
}

function parseArgs(command, message) {
  let uargs = [...message.uargs];

  let types = command.opts.args;
  let nameArray = Object.keys(types);
  let typeArray = Object.values(types);

  message.args = {};

  let i = 0;

  // loop forwards and parse until string-join
  while (true) {
    if (uargs.length == 0) return; // check end

    let type = typeArray[i];

    if (type.includes("join")) break;

    message.args[nameArray[i]] = parse(uargs.shift(), type);
  
    i++;
  }

  i = typeArray.length - 1;

  // loop backwards and parse until string-join
  while (true) {
    if (uargs.length == 0) return; // check end

    let type = typeArray[i];

    if (type.includes("join")) break;

    message.args[nameArray[i]] = parse(uargs.pop(), type);
  
    i--;
  }

  // string-join
  message.args[nameArray[i]] = uargs.join(" ");
}

function parse(str, type) {
  return str;
}

