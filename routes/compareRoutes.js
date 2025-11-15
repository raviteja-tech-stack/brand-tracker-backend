const express = require("express");
const router = express.Router();
const Mention = require("../models/Mention");
const mongoose = require("mongoose");

router.get("/:brandA/:brandB", async (req, res) => {
  try {
    const { brandA, brandB } = req.params;

    async function getBrandData(bid) {
      const total = await Mention.countDocuments({ brandId: bid });

      const sentiment = {
        positive: await Mention.countDocuments({
          brandId: bid,
          sentiment: "positive",
        }),
        negative: await Mention.countDocuments({
          brandId: bid,
          sentiment: "negative",
        }),
        neutral: await Mention.countDocuments({
          brandId: bid,
          sentiment: "neutral",
        }),
      };

      const topicsArr = await Mention.aggregate([
        { $match: { brandId: new mongoose.Types.ObjectId(bid) } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]);

      const topics = {};
      topicsArr.forEach((t) => (topics[t._id] = t.count));

      const trend = await Mention.aggregate([
        { $match: { brandId: new mongoose.Types.ObjectId(bid) } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return { total, sentiment, topics, trend };
    }

    const brandAData = await getBrandData(brandA);
    const brandBData = await getBrandData(brandB);

    const topA = Object.keys(brandAData.topics)[0] || null;
    const topB = Object.keys(brandBData.topics)[0] || null;

    res.json({
      brandA: brandAData,
      brandB: brandBData,
      comparison: {
        text: `Brand A has more mentions (${brandAData.total}) than Brand B (${brandBData.total}).`,
        topTopicA: topA,
        topTopicB: topB,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
