const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeWebsite(url) {
  const html = await axios.get(url);
  const $ = cheerio.load(html.data);
  const results = [];

  $("a").each((i, el) => {
    let text = $(el).text().trim();
    let link = $(el).attr("href");

    if (!text || !link) return;

    if (!link.startsWith("http")) {
      link = url + link;
    }

    results.push({
      text,
      sourceUrl: link,
      publishedAt: new Date(),
    });
  });

  return results;
}

module.exports = { scrapeWebsite };
