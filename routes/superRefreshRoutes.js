const express = require("express");
const router = express.Router();

const { fetchRSSFeed } = require("../services/fetchService");
const { scrapeWebsite } = require("../services/scraperService"); // ✅ Correct import
const Mention = require("../models/Mention");
const { analyzeSentiment } = require("../services/aiService");
const { classifyTopic } = require("../services/topicService");

router.post("/:brandId", async (req, res) => {
  try {
    const { brandId } = req.params;
    const { rssUrl, siteUrl } = req.body;

    let saved = 0;
    let analyzed = 0;
    let classified = 0;

    // 1) Fetch RSS
    if (rssUrl) {
      const items = await fetchRSSFeed(rssUrl);

      for (const i of items) {
        await Mention.create({
          brandId,
          source: "rss",
          text: i.text,
          sourceUrl: i.sourceUrl,
          publishedAt: i.publishedAt,
          sentiment: "pending",
          sentimentScore: 0,
        });
        saved++;
      }
    }

    // 2) Scrape website
    if (siteUrl) {
      const articles = await scrapeWebsite(siteUrl);
      for (const a of articles) {
        await Mention.create({
          brandId,
          source: "web",
          text: a.text,
          sourceUrl: a.sourceUrl,
          publishedAt: a.publishedAt,
          sentiment: "pending",
          sentimentScore: 0,
        });
      }
      saved += articles.length;
    }

    // 3) Sentiment Analysis
    const pending = await Mention.find({ brandId, sentiment: "pending" });

    for (const m of pending) {
      const r = analyzeSentiment(m.text);
      m.sentiment = r.sentiment;
      m.sentimentScore = r.score;
      await m.save();
      analyzed++;
    }

    // 4) Topic classification
    const allMentions = await Mention.find({ brandId });

    for (const m of allMentions) {
      m.category = classifyTopic(m.text);
      await m.save();
      classified++;
    }

    res.json({
      message: "Super Refresh Complete",
      saved,
      analyzed,
      classified,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
