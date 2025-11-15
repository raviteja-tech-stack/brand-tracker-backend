const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
connectDB();
const brandRoutes = require("./routes/brandRoutes");
const mentionRoutes = require("./routes/mentionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const spikeRoutes = require("./routes/spikeRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const superRefreshRoutes = require("./routes/superRefreshRoutes");
const compareRoutes = require("./routes/compareRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/brands", brandRoutes);
app.use("/api/mentions", mentionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/spikes", spikeRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/super-refresh", superRefreshRoutes);
app.use("/api/compare", compareRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Brand Tracker API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
