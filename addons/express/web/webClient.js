const path = require("path");

exports.run = function (express, app) {
  let root = path.join(__dirname, "public");

  app.use(express.static(root));

  app.get("/webclient", (req, res) => {
    res.sendFile("webClient.html", { root: root });
  });
  
  this.vlog("express", "webclient", "ready");
}