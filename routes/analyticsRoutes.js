const express = require("express");
const router = express.Router();
const Mention = require("../models/Mention");
const mongoose = require("mongoose");

// Dashboard Summary
router.get("/:brandId/summary", async (req, res) => {
  const { brandId } = req.params;

  // Total mentions
  const total = await Mention.countDocuments({ brandId });

  // Sentiment counts
  const positive = await Mention.countDocuments({
    brandId,
    sentiment: "positive",
  });
  const negative = await Mention.countDocuments({
    brandId,
    sentiment: "negative",
  });
  const neutral = await Mention.countDocuments({
    brandId,
    sentiment: "neutral",
  });

  // Latest 10 mentions
  const latest = await Mention.find({ brandId })
    .sort({ createdAt: -1 })
    .limit(10);

  // ----------- TOPIC DISTRIBUTION -----------
  const topicsAgg = await Mention.aggregate([
    {
      $match: { brandId: new mongoose.Types.ObjectId(brandId) },
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert array → object for frontend
  const topics = {};
  topicsAgg.forEach((t) => {
    topics[t._id || "other"] = t.count;
  });

  // ----------- TREND (based on publishedAt) -----------
  const trendAgg = await Mention.aggregate([
    {
      $match: { brandId: new mongoose.Types.ObjectId(brandId) },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Convert to frontend format
  const trend = trendAgg.map((item) => ({
    date: item._id,
    count: item.count,
  }));

  // Send final summary
  res.json({
    total,
    sentiment: { positive, negative, neutral },
    latest,
    trend,
    topics,
  });
});

module.exports = router;
