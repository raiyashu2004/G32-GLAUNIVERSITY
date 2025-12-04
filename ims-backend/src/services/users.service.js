
const bcrypt = require("bcryptjs");
const db = require("../db/db-adapter");

exports.create = async ({ email, password, role = "STAFF", name }) => {
  const hashed = await bcrypt.hash(password, 10);
  const user = await db.createUser({ email, password: hashed, role, name });
  // DO NOT return password
  if (user) { delete user.password; }
  return user;
};
