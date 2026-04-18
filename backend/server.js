const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const env = require("./config/env");

const app = express();
let server;

app.disable("x-powered-by");
app.set("trust proxy", env.isProduction ? 1 : 0);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin, "Allowed:", env.clientUrls);
      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true,
  }),
);

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    environment: env.nodeEnv,
    uptime: process.uptime(),
  });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  if (err.message === "CORS origin not allowed") {
    return res.status(403).json({ message: "Origin not allowed" });
  }

  console.error("Unhandled server error", err);
  return res.status(500).json({ message: "Server error" });
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await mongoose.connection.close();
  process.exit(0);
};

const startServer = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");

    server = app.listen(env.port, () => {
      console.log(`Server started on port ${env.port}`);
    });
  } catch (err) {
    console.error("Server startup failed", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  shutdown("SIGINT").catch((err) => {
    console.error("Shutdown error", err);
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM").catch((err) => {
    console.error("Shutdown error", err);
    process.exit(1);
  });
});

startServer();
