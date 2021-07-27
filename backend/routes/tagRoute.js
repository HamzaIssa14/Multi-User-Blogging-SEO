const express = require("express");
const router = express.Router();

// controllers
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/authController");
const { create, list, read, remove } = require("../controllers/tagController");

// validators
const { runValidation } = require("../validators");
const { createTagValidator } = require("../validators/tagValidator");

// only difference is methods not name 'get' | 'post' | 'delete'
router.post(
  "/tag",
  createTagValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.get("/tags", list);
router.get("/tag/:slug", read);
router.delete("/tag/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
