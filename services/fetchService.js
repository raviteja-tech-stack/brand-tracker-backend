const axios = require("axios");
const Parser = require("rss-parser");
const parser = new Parser();

async function fetchRSSFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map((item) => ({
      source: "rss",
      text: item.title + " - " + (item.contentSnippet || ""),
      sourceUrl: item.link,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    }));
  } catch (error) {
    console.error("RSS Fetch Error:", error.message);
    return [];
  }
}

module.exports = {
  fetchRSSFeed,
};
