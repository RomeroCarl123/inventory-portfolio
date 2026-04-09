import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NETLIFY_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

const ensureDemoUser = async () => {
  const demoUsername = process.env.DEMO_USERNAME || "demo";
  const demoPassword = process.env.DEMO_PASSWORD || "demo123";

  const existing = await User.findOne({ username: demoUsername });
  if (!existing) {
    try {
      await User.create({ username: demoUsername, password: demoPassword });
      console.log(`Demo user created: ${demoUsername}`);
    } catch (err) {
      if (err?.code === 11000) {
        // Another process/restart created it first
        return;
      }
      throw err;
    }
  }
};

mongoose
  .connect(
    process.env.MONGO_URI?.startsWith("mongodb://") ||
      process.env.MONGO_URI?.startsWith("mongodb+srv://")
      ? process.env.MONGO_URI
      : undefined,
  )
  .then(async () => {
    console.log("MongoDB connected");
    try {
      await ensureDemoUser();
    } catch (err) {
      console.warn(
        "MongoDB connected, but demo user setup failed:",
        err?.message,
      );
    }
  })
  .catch((err) => {
    console.warn(
      "MongoDB not connected. Set a valid MONGO_URI (mongodb:// or mongodb+srv://). Running in demo fallback mode:",
      err?.message,
    );
  });

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API is running"));
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.listen(port, () => console.log(`Server running on port ${port}`));
