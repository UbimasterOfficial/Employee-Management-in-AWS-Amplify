require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./user");

const app = express();
const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

const extraCorsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowedPatterns = [
        /^http:\/\/localhost(:\d+)?$/,
        /^http:\/\/127\.0\.0\.1(:\d+)?$/,
        /^https:\/\/.*\.amplifyapp\.com$/,
        ...extraCorsOrigins.map((entry) =>
          entry.startsWith("/") && entry.endsWith("/")
            ? new RegExp(entry.slice(1, -1))
            : entry
        ),
      ];
      const allowed = allowedPatterns.some((entry) =>
        entry instanceof RegExp ? entry.test(origin) : entry === origin
      );
      if (allowed || process.env.CORS_STRICT !== "true") {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Employee CRUD API is running" });
});

app.use("/api/users", userRoutes);

if (!mongoUri) {
  console.error(
    "MongoDB connection error: Missing MONGODB_URI or MONGO_URI in environment variables."
  );
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
