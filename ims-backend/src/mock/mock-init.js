const USE_MOCK = process.env.USE_MOCK_DB === "1" || process.env.USE_MOCK_DB === "true";

function initDb() {
  if (USE_MOCK) {
    global.db = require("./mock-db");
    console.log("Using mock DB (global.db attached).");
  } else {
    console.log("Not using mock DB. Please attach real DB to global.db in your integration.");
  }
}

module.exports = { initDb };
