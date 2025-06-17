const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

let users = [
  { id: 1, username: "admin", password: bcrypt.hashSync("password123", 10) }
];

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
  res.json({ token });
});

const jwt = require("jsonwebtoken");

app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    return res.json({ user: { username: decoded.username } });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
});


app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
