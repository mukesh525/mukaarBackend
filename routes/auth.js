const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .send({ message: error.details[0].message.replace(/['"]+/g, "") });

  var user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).send({ message: "Invalid email or password.." });
  await user.save();
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send({ message: "Invalid email or password." });
  user.password = undefined;
  const token = user.generateAuthToken();
  return res.status(200).send({ token: token, user: user });
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
