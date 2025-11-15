const express = require("express");
const router = express.Router();
const Mention = require("../models/Mention");
const { fetchRSSFeed } = require("../services/fetchService");
const { analyzeSentiment } = require("../services/aiService");
const { classifyTopic } = require("../services/topicService");
const { scrapeWebsite } = require("../services/scraperService");

// Get all mentions
router.get("/", async (req, res) => {
  try {
    const mentions = await Mention.find().sort({ createdAt: -1 }).limit(50);
    res.json(mentions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route - Fetch RSS without saving
router.get("/fetch-rss", async (req, res) => {
  const { url } = req.query;
  const items = await fetchRSSFeed(url);
  res.json({ count: items.length, items });
});

// Save fetched mentions
router.post("/fetch-and-save", async (req, res) => {
  const { brandId, url } = req.body;

  if (!brandId || !url) {
    return res.status(400).json({ error: "brandId and url required" });
  }

  const items = await fetchRSSFeed(url);
  const savedMentions = [];

  for (const item of items) {
    const mention = await Mention.create({
      brandId,
      source: "rss",
      text: item.text,
      sourceUrl: item.sourceUrl,
      publishedAt: item.publishedAt,
      sentiment: "pending",
      sentimentScore: 0,
    });

    savedMentions.push(mention);
  }

  res.json({ message: "RSS mentions saved", savedCount: savedMentions.length });
});

// Analyze sentiment
router.post("/analyze-sentiment", async (req, res) => {
  const { brandId } = req.body;

  if (!brandId) return res.status(400).json({ error: "brandId required" });

  const mentions = await Mention.find({ brandId, sentiment: "pending" });

  for (const mention of mentions) {
    const result = analyzeSentiment(mention.text);

    mention.sentiment = result.sentiment;
    mention.sentimentScore = result.score;

    await mention.save();
  }

  res.json({
    message: "Sentiment analysis complete",
    analyzedCount: mentions.length,
  });
});

// Topic Classification
router.post("/classify-topics", async (req, res) => {
  const { brandId } = req.body;

  if (!brandId) return res.status(400).json({ error: "brandId required" });

  const mentions = await Mention.find({ brandId });

  for (const mention of mentions) {
    mention.category = classifyTopic(mention.text);
    await mention.save();
  }

  res.json({
    message: "Topic classification complete",
    classified: mentions.length,
  });
});

router.post("/scrape-and-save", async (req, res) => {
  const { brandId, url } = req.body;

  if (!brandId || !url) {
    return res.status(400).json({ error: "brandId and url required" });
  }

  const items = await scrapeWebsite(url);
  const saved = [];

  for (let item of items) {
    const mention = await Mention.create({
      brandId,
      source: "web",
      text: item.text,
      sourceUrl: item.sourceUrl,
      publishedAt: item.publishedAt,
      sentiment: "pending",
      sentimentScore: 0,
      category: "other",
    });
    saved.push(mention);
  }

  res.json({
    message: "Web scraping complete",
    savedCount: saved.length,
  });
});

module.exports = router;
