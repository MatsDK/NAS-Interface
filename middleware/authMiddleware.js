const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const { generateAccessToken } = require("../jwtTokens");

const authenticateToken = async (req, res, next) => {
  const redirectPage = "/auth/login";

  const token = req.cookies.jwt;
  if (!token) return res.status(200).redirect(redirectPage);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);
    const dbUser = await userModel.findById(decodedToken.user);

    if (err) {
      if (!dbUser || dbUser.refreshToken == "empty")
        return res.status(200).redirect(redirectPage);

      jwt.verify(
        dbUser.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, newUser) => {
          if (err) return res.status(200).redirect(redirectPage);

          res.cookie("jwt", generateAccessToken(decodedToken.user), {
            maxAge: 3600000 * 2,
            httpOnly: true,
          });
          req.user = dbUser;
          // req.isAuth = true;
          next();
        }
      );
    } else {
      // req.isAuth = true;
      req.user = dbUser;
      next();
    }
  });
};

module.exports = authenticateToken;
