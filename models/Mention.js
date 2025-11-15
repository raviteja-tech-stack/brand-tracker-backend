const mongoose = require("mongoose");

const mentionSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    source: String, // news, reddit, blog, rss
    text: String, // content
    sentiment: String, // positive, negative, neutral
    sentimentScore: Number, // -1 to 1
    publishedAt: Date,
    sourceUrl: String,

    category: {
      type: String,
      default: "other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mention", mentionSchema);
