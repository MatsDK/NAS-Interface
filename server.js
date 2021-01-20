require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.set("view engine", "ejs");

mongoose.connect(process.env.DB_LOCATION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("connected to database"));

const authRouter = require("./routes/authRoute");
const filesRouter = require("./routes/indexRouter");

app.use("/auth", authRouter);
app.use("/", filesRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server listening on port ${port}`));
