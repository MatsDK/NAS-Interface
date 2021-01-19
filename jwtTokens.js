const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  return jwt.sign({ user: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ user: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
