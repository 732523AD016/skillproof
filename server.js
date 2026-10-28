require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// ---------- User model ----------
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, unique: true, sparse: true, lowercase: true },
      password: { type: String }, // GitHub users ku password irukkadhu
      githubId: { type: String, unique: true, sparse: true },
      githubUsername: String,
      avatar: String,
      githubToken: { type: String, select: false }
    },
    { timestamps: true }
  )
);

const createToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// ---------- Basic route ----------
app.get("/", (req, res) => {
  res.send("SkillProof API is running!");
});

// ---------- Email signup ----------
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        message: "Enter name, email and password (minimum 8 characters)"
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "Signup successful!",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// ---------- Email login ----------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });

    if (!user || !user.password || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful!",
      token: createToken(user),
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// ---------- GitHub OAuth: step 1 (GitHub page ku redirect) ----------
app.get("/api/auth/github", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: process.env.GITHUB_CALLBACK_URL,
    scope: "read:user user:email"
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// ---------- GitHub OAuth: step 2 (callback) ----------
app.get("/api/auth/github/callback", async (req, res) => {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const { code } = req.query;

  if (!code) return res.redirect(`${clientUrl}/?error=no_code`);

  try {
    // code -> access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL
      })
    });
    const { access_token } = await tokenRes.json();
    if (!access_token) throw new Error("No access token from GitHub");

    const ghHeaders = {
      Authorization: `Bearer ${access_token}`,
      "User-Agent": "SkillProof",
      Accept: "application/vnd.github+json"
    };

    // GitHub profile
    const ghUser = await (await fetch("https://api.github.com/user", { headers: ghHeaders })).json();

    // Primary email (private-a irundha /user/emails la irukkum)
    let email = ghUser.email;
    if (!email) {
      const emails = await (await fetch("https://api.github.com/user/emails", { headers: ghHeaders })).json();
      if (Array.isArray(emails)) {
        email = (emails.find((e) => e.primary && e.verified) || emails[0] || {}).email;
      }
    }
    email = (email || `${ghUser.login}@users.noreply.github.com`).toLowerCase();

    // Find or create user
    let user = await User.findOne({ $or: [{ githubId: String(ghUser.id) }, { email }] });

    if (!user) {
      user = await User.create({
        name: ghUser.name || ghUser.login,
        email,
        githubId: String(ghUser.id),
        githubUsername: ghUser.login,
        avatar: ghUser.avatar_url,
        githubToken: access_token
      });
    } else {
      user.githubId = String(ghUser.id);
      user.githubUsername = ghUser.login;
      user.avatar = ghUser.avatar_url;
      user.githubToken = access_token;
      await user.save();
    }

    // JWT oda frontend ku thirumba anuppu
    res.redirect(`${clientUrl}/?token=${createToken(user)}&login=success`);
  } catch (error) {
    console.error("GitHub auth error:", error.message);
    res.redirect(`${clientUrl}/?error=auth_failed`);
  }
});

// ---------- Logged-in user details ----------
app.get("/api/auth/me", async (req, res) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      githubUsername: user.githubUsername,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// ---------- Start ----------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error("MongoDB error:", error.message));