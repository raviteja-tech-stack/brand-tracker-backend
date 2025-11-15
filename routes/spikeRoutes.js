const express = require("express");
const router = express.Router();
const Mention = require("../models/Mention");
const mongoose = require("mongoose");

router.get("/:brandId", async (req, res) => {
  const { brandId } = req.params;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Today mentions
  const todayCount = await Mention.countDocuments({
    brandId: new mongoose.Types.ObjectId(brandId),
    createdAt: { $gte: today },
  });

  // Yesterday mentions
  const yesterdayCount = await Mention.countDocuments({
    brandId: new mongoose.Types.ObjectId(brandId),
    createdAt: { $gte: yesterday, $lt: today },
  });

  const spike = todayCount > yesterdayCount * 1.5; // 50% spike
  const spikePercent = yesterdayCount
    ? (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(1)
    : 100;

  res.json({
    todayCount,
    yesterdayCount,
    spike,
    spikePercent,
  });
});

module.exports = router;
