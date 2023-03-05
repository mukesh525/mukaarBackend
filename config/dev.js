module.exports = {
  DB_URI: process.env.DB_URI || "mongodb://localhost:27017/mukaar",
  SECRET: process.env.SECRET || "secret",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  BUCKET: "mukaar",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};
