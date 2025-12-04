require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`IMS backend running on port ${PORT} (env USE_MOCK_DB=${process.env.USE_MOCK_DB})`);
});
