const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function analyzeSentiment(text) {
  const result = sentiment.analyze(text);

  let label = "neutral";
  if (result.score > 0) label = "positive";
  else if (result.score < 0) label = "negative";

  return {
    sentiment: label,
    score: result.score / 10, // normalize score -1 to 1
  };
}

module.exports = { analyzeSentiment };
