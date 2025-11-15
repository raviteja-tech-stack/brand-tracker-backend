const express = require("express");
const router = express.Router();
const Mention = require("../models/Mention");
const mongoose = require("mongoose");

// -----------------------------
// UPGRADED AI-LIKE INSIGHTS ENGINE
// -----------------------------
function generateInsights(data) {
  const { sentiment, trend, topics } = data;

  // 1️⃣ Sentiment Insight
  let sentimentInsight = "";
  const total = sentiment.positive + sentiment.negative + sentiment.neutral;

  const positiveRatio = (sentiment.positive / total) * 100;
  const negativeRatio = (sentiment.negative / total) * 100;

  if (positiveRatio - negativeRatio >= 15) {
    sentimentInsight =
      "Sentiment is strongly positive. Users are expressing high satisfaction.";
  } else if (negativeRatio - positiveRatio >= 15) {
    sentimentInsight =
      "Sentiment is strongly negative. There may be complaints or issues rising.";
  } else if (positiveRatio > negativeRatio) {
    sentimentInsight =
      "Sentiment is slightly positive with a generally favorable tone.";
  } else if (negativeRatio > positiveRatio) {
    sentimentInsight =
      "Sentiment is slightly negative, showing mild dissatisfaction.";
  } else {
    sentimentInsight = "Sentiment is stable and neutral.";
  }

  // 2️⃣ Topic Insight
  let topTopic = "other";
  let maxCount = 0;

  for (const t in topics) {
    if (topics[t] > maxCount) {
      maxCount = topics[t];
      topTopic = t;
    }
  }

  const topicInsight = `Most discussions are centered around **${topTopic}**, indicating it's the most talked-about aspect recently.`;

  // 3️⃣ Spike Detection
  let spikeInsight = "No major spike detected.";
  let spikePercent = 0;

  if (trend.length > 2) {
    const latest = trend[trend.length - 1].count;
    const previous = trend[trend.length - 2].count;

    if (previous > 0) {
      spikePercent = Math.round(((latest - previous) / previous) * 100);
    }

    if (spikePercent > 40) {
      spikeInsight = `A strong spike of **${spikePercent}%** occurred recently — possibly due to news events or trending topics.`;
    } else if (spikePercent > 15) {
      spikeInsight = `A moderate spike of **${spikePercent}%** was observed.`;
    }
  }

  // 4️⃣ Trend Insight
  let trendInsight = "Trend is stable.";
  if (trend.length > 3) {
    const last3 = trend.slice(-3).map((t) => t.count);
    const avgPrev = trend.slice(-6, -3).reduce((a, b) => a + b.count, 0) / 3;
    const avgRecent = last3.reduce((a, b) => a + b, 0) / 3;

    if (avgRecent > avgPrev * 1.4) {
      trendInsight = "Mentions are rising sharply over the past few days.";
    } else if (avgRecent < avgPrev * 0.7) {
      trendInsight = "Mentions are dropping significantly recently.";
    } else if (avgRecent > avgPrev) {
      trendInsight = "Mentions are slowly increasing.";
    } else {
      trendInsight = "Mentions are slightly decreasing.";
    }
  }

  // 5️⃣ Prediction
  let prediction = "Mentions expected to remain stable.";
  if (spikePercent > 40)
    prediction = "Mentions likely to continue increasing due to recent spike.";
  else if (trendInsight.includes("sharp"))
    prediction = "Mentions likely to rise further.";
  else if (trendInsight.includes("dropping"))
    prediction = "Mentions may continue decreasing.";
  else if (sentimentInsight.includes("strongly negative"))
    prediction = "Expect negative mentions to grow unless resolved.";

  // 6️⃣ Recommendation
  let recommendation = "Maintain engagement with your audience.";

  if (sentiment.negative > sentiment.positive) {
    recommendation = "Address negative feedback quickly to improve sentiment.";
  } else if (topTopic === "feature") {
    recommendation =
      "Highlight new features or improvements to maintain momentum.";
  } else if (spikePercent > 40) {
    recommendation =
      "Capitalize on the spike by increasing marketing visibility.";
  } else if (trendInsight.includes("dropping")) {
    recommendation =
      "Increase audience engagement to recover declining interest.";
  }

  return {
    sentimentInsight,
    topicInsight,
    spikeInsight,
    trendInsight,
    prediction,
    recommendation,
    topTopic,
  };
}

// -----------------------------
// INSIGHTS ENDPOINT
// -----------------------------
router.get("/:brandId", async (req, res) => {
  const { brandId } = req.params;

  // Fetch sentiment
  const sentiment = {
    positive: await Mention.countDocuments({ brandId, sentiment: "positive" }),
    negative: await Mention.countDocuments({ brandId, sentiment: "negative" }),
    neutral: await Mention.countDocuments({ brandId, sentiment: "neutral" }),
  };

  // Fetch topics
  const topicsAgg = await Mention.aggregate([
    { $match: { brandId: new mongoose.Types.ObjectId(brandId) } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const topics = {};
  topicsAgg.forEach((t) => (topics[t._id] = t.count));

  // Trend
  const trend = await Mention.aggregate([
    { $match: { brandId: new mongoose.Types.ObjectId(brandId) } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$publishedAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Generate insights
  const insights = generateInsights({ sentiment, topics, trend });

  res.json(insights);
});

module.exports = router;
