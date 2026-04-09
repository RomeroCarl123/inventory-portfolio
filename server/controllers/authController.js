import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.json({ message: "User registered" });
};

export const login = async (req, res) => {
  const { username = "", password = "" } = req.body;

  const normalizedUsername = String(username).trim();
  const normalizedPassword = String(password).trim();

  const demoUsername = process.env.DEMO_USERNAME || "demo";
  const demoPassword = process.env.DEMO_PASSWORD || "demo123";
  const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret";

  // Always allow demo login (useful when MongoDB is not configured yet)
  if (
    normalizedUsername.toLowerCase() === demoUsername.toLowerCase() &&
    normalizedPassword === demoPassword
  ) {
    const token = jwt.sign({ id: "demo-user", role: "demo" }, jwtSecret, {
      expiresIn: "1d",
    });
    return res.json({ token });
  }

  try {
    const user = await User.findOne({ username: normalizedUsername });

    if (user && (await user.matchPassword(normalizedPassword))) {
      const token = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: "1d",
      });
      return res.json({ token });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch {
    return res.status(503).json({
      message:
        "Auth service unavailable (database not connected). Use demo credentials.",
    });
  }
};
