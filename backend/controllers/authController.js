const User = require("../models/userModel");
const Blog = require("../models/blogModel");

const shortId = require("shortid");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandler");

const expressJwt = require("express-jwt");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: "Email is taken",
      });
    }

    const { name, email, password } = req.body;
    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
    let newUser = new User({
      name,
      email,
      password,
      profile,
      username,
    });
    newUser.save((err, success) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "Signup success! Please signin",
      });
    });
  });
};

exports.signin = (req, res) => {
  // check if user exists
  const { email, password } = req.body;
  // authenticate the user, (the user's email and password should match what we have saved in our DB)
  User.findOne({ email: email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist, Please Sign Up",
      });
    }
    // autheticate
    if (!user.authenticate(password)) {
      // if the password DOESNT match our DB
      return res.status(400).json({
        error: "Password is INCORRECT. Please Try again.",
      });
    }
    // generate a JSON Web Token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    }); // we sign/create a json webtoken for this user
    res.cookie("token", token, { expiresIn: "7d" }); // we save the token to the web cookie too

    const { _id, username, name, email, role } = user;
    // SEND the user the JWT token
    return res.json({
      token: token,
      user: { _id, username, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "Signout success",
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.auth._id; // WHY REQ.AUTH._ID
  User.findById({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.auth._id; // WHY REQ.AUTH._ID
  User.findById({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resource. Access denied",
      });
    }

    req.profile = user;
    next();
  });
};

exports.canUpdateDeleteBlog = (req, res, next) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    let authorizedUser =
      data.postedBy._id.toString() === req.profile._id.toString();
    if (!authorizedUser) {
      return res.status(400).json({
        error: "You are not authorized",
      });
    }
    next();
  });
};
