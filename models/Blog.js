const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    tags: [String],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    targetAudience: {
      type: String,
    },
    postStatus: {
      type: String,
      default: "Draft",
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    thumbnails: [String],

    seoSettings: {
      metaTitle: String,
      metaDescription: String,
      slug: { type: String, unique: true },
      tags: [String],
      ogImage: String,
      altText: String,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        status: {
          type: String,
          default: "Draft",
        },
        type: { type: String, default: "Comment" },
        parentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog.comments",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
