const _ = require("lodash");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { User, validate, validateUpdate } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
var ObjectId = require("mongoose").Types.ObjectId;

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message.replace(/['"]+/g, "") });

  let user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user)
    return res.status(400).send({ message: "Email already registered." });

  let username = await User.findOne({
    username: req.body.username.toLowerCase()
  });
  if (username)
    return res.status(400).send({ message: "Username already exists." });

  user = new User(_.pick(req.body, ["username", "name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .status(201)
    .send({ message: "Registered Successfully" });
});

router.put("/", auth, async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message.replace(/['"]+/g, "") });

  if (req.body.email !== req.user.email) {
    let isEmail = await User.findOne({ email: req.body.email });
    if (isEmail)
      return res.status(400).send({ message: "email already exists" });
  }

  let update = await User.findOneAndUpdate({ email: req.user.email }, req.body);
  if (!update) return res.status(400).send({ message: "Updating User failed" });

  return res.status(200).send({ message: "Updated Successfully" });

});

router.post("/password", auth, async (req, res) => {
  const PasswordSchema = {
    old_password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    new_password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  const { error } = Joi.validate(req.body, PasswordSchema);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message.replace(/['"]+/g, "") });

  let user = await User.findOne({ email: req.user.email });
  if (!user)
    return res.status(400).send({ message: "Invalid email or password." });

  const validPassword = await bcrypt.compare(
    req.body.old_password,
    user.password
  );
  if (!validPassword)
    return res.status(400).send({ message: "Invalid old password." });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.new_password, salt);

  let update = await user.save();
  if (!update) return res.status(400).send({ message: "Updating User failed" });

  return res.status(200).send({ message: "Password changed Successfully" });
});

router.delete("/", auth, async (req, res) => {
  let user = await User.findOne({ email: req.user.email });
  if (user) {
    let post = await Post.findOne({ postedBy: user.id });
    if (post) post.remove();
    let story = await Story.findOne({ postedBy: user.id });
    if (story) story.remove();

    await Report.deleteOne({ byUser: post.id });
    await Report.deleteOne({ user: user.id });
    user.remove();
  }

  // if (!update) return res.status(400).send({"message":'Updating User failed'});
  return res.status(200).send({ message: "User deleted succesfully" });
});

router.get("/", auth, async (req, res) => {
  var query =
    req.query.userId && ObjectId.isValid(req.query.userId)
      ? { _id: req.query.userId }
      : { email: req.user.email };
  var fields = "-__v";
  User.findOne(query)
    .select(fields)
    .exec((err, user) => {
      if (err) return res.status(400).send({ message: e.message });
      return res.status(200).send(user);
    });
});

module.exports = router;
