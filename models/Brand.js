const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    queryTerms: [{ type: String }], // keywords to search for brand
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
