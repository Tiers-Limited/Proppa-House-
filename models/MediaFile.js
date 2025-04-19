const mongoose = require("mongoose");

const mediaFileSchema = new mongoose.Schema(
  {
    title: String,
    altText: { type: String, required: true },
    description: String,
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
    tags: [String],
    fileType: String,
    fileExtension: String,
    fileName: String,
    filePath: String,
    sizeInMB: Number,
    isCompressed: { type: Boolean, default: false },
    thumbnail: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MediaFile", mediaFileSchema);
