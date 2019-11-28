const jwt = require("jsonwebtoken");
const Joi = require("joi");

const mongoose = require("mongoose");
const config = require("../config");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },

    username: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      unique: true
    },

    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255
    }
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      username: this.username
    },
    config.SECRET
  );
  return token;
};

userSchema.index({ device_token: 1, email: 1 });

userSchema.pre("save", function(next) {
  if (this.reviews != undefined && this.reviews.length > 0) {
  }
  next();
});

const User = mongoose.model("User", userSchema);

validateUser = user => {
  const schema = {
    username: Joi.string()
      .min(5)
      .max(50)
      .required(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema, { allowUnknown: false });
};
validateUserUpdate = user => {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
  };
  return Joi.validate(user, schema, { allowUnknown: false });
};

exports.User = User;
exports.validate = validateUser;
exports.validateUpdate = validateUserUpdate;
