const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    body: {
      type: {},
      required: true,
      min: 200,
      max: 2000000,
    },
    excerpt: {
      type: String,
      max: 1000,
    },
    mtitle: {
      // meta title for SEO, search engings will search for this
      type: String,
    },
    mdesc: {
      // meta description, search engines will present this description
      type: String,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    categories: [
      // array of Category objects/models/instances
      {
        type: ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    tags: [
      // array of Category objects/models/instances, hence the square brackets
      {
        type: ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Blog", blogSchema);
