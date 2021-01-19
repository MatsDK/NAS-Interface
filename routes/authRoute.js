const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");

const userModel = require("../models/userModel");

const authenticateToken = require("../middleware/authMiddleware");
const { generateAccessToken, generateRefreshToken } = require("../jwtTokens");

router
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.findOne({ email }).exec();
      if (!user) return res.send("incorect email");

      if (!(await bcrypt.compare(password, user.password)))
        return res.send("incorrect password");

      // if (!user.isVerified)
      //   return res.send("your account needs to be verified");

      const accessToken = generateAccessToken(user._id);

      user.refreshToken = generateRefreshToken(user._id);

      await user.save((err, doc) => {
        if (err) throw err;
      });

      res
        .cookie("jwt", accessToken, { maxAge: 3600000 * 2, httpOnly: true })
        .json({ redirect: "/" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: err.message });
    }
  });

router
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      if (await userModel.exists({ email })) {
        return res.json({ msg: "user already exists" });
      } else {
        const user = new userModel({
          name,
          email,
          password: hashedPassword,
          refreshToken: "empty",
        });

        const userDataFolderPath = `../data/${user._id}`;
        if (!fs.existsSync(userDataFolderPath))
          fs.mkdirSync(userDataFolderPath);

        await user.save();
        res.status(201).json({ redirect: "/auth/login" });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ msg: err.message });
    }
  });

router.get("/logout", authenticateToken, async (req, res) => {
  try {
    const decodedCookie = jwt.decode(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decodedCookie)
      return res.status(200).json({ redirect: "/auth/login" });

    await userModel.findByIdAndUpdate(
      decodedCookie.user,
      {
        refreshToken: "empty",
      },
      (err) => {
        if (err) throw err;
      }
    );

    res
      .status(200)
      .cookie("jwt", "", { maxAge: 0, httpOnly: true })
      .json({ redirect: "/auth/login" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;
