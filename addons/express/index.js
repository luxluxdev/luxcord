exports.run = function () {
  const express = require("express");
  const app = express();

  app.get("/*", (req, res, next) => {
    require("./main/logger.js").run.call(this, req, res);
    next();
  });

  if (this.opts.uptimer)
    app.get("/ping", (req, res) => { this.vlog("express", "uptimer", "ping received"); res.sendStatus(200); });

  if (this.opts.useWebClient)
    require("./web/webClient.js").run.call(this, express, app);

  if (this.opts.listen) {
    let port = this.opts.port || 3000;
    app.listen(port);
    this.vlog("express", "listening", `port ${port}`);
  }
}