require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./user");

const app = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "0.0.0.0";
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

const DEFAULT_ALLOWED_ORIGINS = [
  "https://frontend-dev.d173bi0k0a6t1i.amplifyapp.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const envOrigins = [
  process.env.AMPLIFY_FRONTEND_URL,
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : []),
].filter(Boolean);

const allowedOriginStrings = [
  ...new Set([...DEFAULT_ALLOWED_ORIGINS, ...envOrigins]),
];

const allowedPatterns = [
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/[\w.-]+\.amplifyapp\.com$/,
  ...allowedOriginStrings.map((entry) =>
    entry.startsWith("/") && entry.endsWith("/")
      ? new RegExp(entry.slice(1, -1))
      : entry
  ),
];

function isOriginAllowed(origin) {
  if (!origin) return true;
  return allowedPatterns.some((entry) =>
    entry instanceof RegExp ? entry.test(origin) : entry === origin
  );
}

const corsOptions = {
  origin(origin, callback) {
    if (isOriginAllowed(origin)) {
      return callback(null, true);
    }
    if (process.env.CORS_STRICT === "true") {
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Employee CRUD API is running" });
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    corsOrigins: allowedOriginStrings,
  });
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
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log("CORS allowed origins:", allowedOriginStrings.join(", "));
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
