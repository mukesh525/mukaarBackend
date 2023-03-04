const jwt = require("jsonwebtoken");
const Joi = require("joi");

const mongoose = require("mongoose");
const config = require("../config");

const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },


    email: {
      type: String,
      required: true,

    }
  },
  { timestamps: true, versionKey: false }
);





const contact = mongoose.model("contact", contactSchema);



exports.Contact = contact;