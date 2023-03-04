const _ = require("lodash");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const { Contact } = require("../models/contact_us");

const { sendTextEmail } = require("../utils/email");

router.post("/", async (req, res) => {

  let user = new Contact(_.pick(req.body, ["email", "phone"]));
  await user.save();
  sendTextEmail("Mukaar New Contact Form", `Mukaar New Contact Form email : ${req.body.email} phone : ${req.body.phone}`, "mukeshjha2007@gmail.com");
  res
    .status(200)
    .send({ message: "Contact Updated Successfully" });
});


router.get("/", async (req, res) => {
  //console.log(req.body)
  let contacts = await Contact.find();
  res
    .status(200)
    .send(contacts);
});

module.exports = router;
