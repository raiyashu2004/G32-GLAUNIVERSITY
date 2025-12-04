const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db-adapter");

exports.login = async (email, password) => {
  const user = await db.getUserByEmail(email);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  const payload = { userId: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET || "changeme", {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h"
  });
  return { accessToken: token };
};
