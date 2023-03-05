
const auth = require("../routes/auth");
const user = require("../routes/user");
const contact = require("../routes/contact");
const error = require("../middleware/error");
const upload = require("../routes/upload");
var bodyParser = require("body-parser");

module.exports = function (app) {
  app.use(bodyParser.json({ limit: "50mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use("/v1/api/auth", auth);
  app.use("/v1/api/user", user);
  app.use("/v1/api/contact", contact);
  app.use("/v1/api/upload", upload);
  app.use(error);
};
