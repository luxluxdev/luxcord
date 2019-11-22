const requireall = require("require-all");
const fs = require("fs");

exports.run = (client) => {
  let commands, events;
  if (fs.existsSync(client.opts.cmddir)) commands = requireall(client.opts.cmddir);
  if (fs.existsSync(client.opts.evtdir)) events = requireall(client.opts.evtdir);

  for (let name in commands) {
    f = commands[name].run
    cmd = commands[name].opts && commands[name].opts.name || name;
    client.cmd(cmd, f);
  }

  for (let name in events) {
    f = events[name].run
    evt = name;
    client.evt(evt, f);
  }
}