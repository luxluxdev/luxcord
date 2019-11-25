const requireall = require("require-all");
const fs = require("fs");

exports.run = (client) => {
  let commands, events;
  if (client.opts.scancmd && fs.existsSync(client.opts.cmddir)) commands = requireall(client.opts.cmddir);
  if (client.opts.scanevt && fs.existsSync(client.opts.evtdir)) events = requireall(client.opts.evtdir);

  for (let name in commands) {
    if (commands[name].luxcord === false) continue;

    f = commands[name].run;
    if (!commands[name].opts) {
      cmd = name;
    } else {
      commands[name].opts.name = commands[name].opts.name || name;
      cmd = commands[name].opts;
    }
    client.cmd(cmd, f);
  }

  for (let name in events) {
    f = events[name].run
    evt = name;
    client.evt(evt, f);
  }
}