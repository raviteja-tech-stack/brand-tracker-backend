const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");

// Create brand
router.post("/", async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all brands
router.get("/", async (req, res) => {
  const brands = await Brand.find();
  res.json(brands);
});

module.exports = router;
