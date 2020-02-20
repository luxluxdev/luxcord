exports.run = function () {
  const projectName = process.env.PROJECT_DOMAIN;
  const period = 280000;

  if (!projectName) return this.vlog("addons", "glitchUptimer", "PROJECT_DOMAIN undefined - Seems like this isn't a Glitch app...");

  const pingURL = `http://${projectName}.glitch.me/ping`;
  this.vlog("addons", "glitchUptimer", `Sending an HTTP request to ${pingURL} every ${period}ms`)
  setInterval(() => { require("http").get(pingURL); }, period);
}