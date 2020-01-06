const requireall = require("require-all");
const fs = require("fs");
const path = require("path");

exports.run = (client) => {
  // scan commands
  let commands = [], events = [];
  client.vlog("scanner", "command modules");
  if (client.opts.scancmd && fs.existsSync(client.opts.cmddir)) commands = requireall(client.opts.cmddir);

  
  client.vlog("scanner", "command modules", "found: " + Object.keys(commands).length);
  for (let name in commands) {
    if (commands[name].luxcord === false) continue;

    f = commands[name].run;
    // get file name or name or opts.name
    if (!commands[name].opts) {
      cmd = name;
    } else {
      commands[name].opts.name = commands[name].opts.name || name;
      cmd = commands[name].opts;
    }
    client.cmd(cmd, f);
  }

  // scan events
  client.vlog("scanner", "event modules");
  if (client.opts.scanevt && fs.existsSync(client.opts.evtdir)) events = requireall(client.opts.evtdir);

  client.vlog("scanner", "event modules", "found: " + Object.keys(events).length);
  for (let name in events) {
    f = events[name].run
    evt = name;
    client.evt(evt, f);
  }
}