const mongoose = require("mongoose");
const crypto = require("crypto");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      max: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    profile: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: String,
    about: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamp: true }
);

userSchema
  .virtual("password") // a virtual field/ not saved in DB
  .set(function (password) {
    // create a temporary variable called _password
    this._password = password;
    // generate salt for the hashing algorithm
    this.salt = this.makeSalt();
    // encryptPassword
    this.hashed_password = this.encryptPassword(password); // this is how we are going to save the hashed password in our database
  })
  .get(function () {
    return this._password; // Now our virtual field, that isnt saved in DB, will be 'password' and this .get() function will set this virtual fields value to be the NON-hashed password.
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password; // is the inputted password, converted to hashed, equivelant to saved hashed passowrd?
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + ""; // this will allow us to salt our algorithm really well
  },
};

module.exports = mongoose.model("User", userSchema);
