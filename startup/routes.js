
const auth = require("../routes/auth");
const user = require("../routes/user");
const error = require("../middleware/error");
var bodyParser = require("body-parser");

module.exports = function(app) {
  app.use(bodyParser.json({ limit: "50mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use("/v1/api/auth", auth);
  app.use("/v1/api/user", user);
  app.use(error);
};
