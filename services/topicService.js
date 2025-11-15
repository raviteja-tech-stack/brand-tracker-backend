function classifyTopic(text) {
  text = text.toLowerCase();

  // Health
  if (
    text.includes("covid") ||
    text.includes("virus") ||
    text.includes("mask") ||
    text.includes("health") ||
    text.includes("infection")
  ) {
    return "health";
  }

  // Politics
  if (
    text.includes("modi") ||
    text.includes("bjp") ||
    text.includes("congress") ||
    text.includes("china") ||
    text.includes("pakistan") ||
    text.includes("government") ||
    text.includes("policy") ||
    text.includes("election")
  ) {
    return "politics";
  }

  // Technology
  if (
    text.includes("iphone") ||
    text.includes("apple") ||
    text.includes("ai") ||
    text.includes("tech") ||
    text.includes("software") ||
    text.includes("device") ||
    text.includes("android")
  ) {
    return "technology";
  }

  // Business
  if (
    text.includes("market") ||
    text.includes("stock") ||
    text.includes("economy") ||
    text.includes("business") ||
    text.includes("price") ||
    text.includes("sale") ||
    text.includes("budget")
  ) {
    return "business";
  }

  return "other";
}

module.exports = { classifyTopic };
