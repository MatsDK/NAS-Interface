const express = require("express");
const router = express.Router();

const AdmZip = require("adm-zip");
const dree = require("dree");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const dataFolder = "../data/";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dirName = `${dataFolder}${req.user._id}/${req.params.path.replace(
      /&/g,
      "/"
    )}`;
    if (req.params.path == "&root") cb(null, `${dataFolder}${req.user._id}`);
    else cb(null, dirName);
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}$${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const authenticateToken = require("../middleware/authMiddleware");

router.all("*", authenticateToken);

router.get("/", (req, res) => {
  const tree = getFileTree(`../data/${req.user._id}`);
  res.render("home", {
    path: "/",
    tree: tree,
    fullTree: tree,
    userData: { name: req.user.name, email: req.user.email },
  });
});

router.get("/:path", (req, res) => {
  const dirPath = `${dataFolder}${req.user._id}/${req.params.path.replace(
    /&/g,
    "/"
  )}`;

  const tree = getFileTree(dirPath);
  const fullFileTree = getFileTree(`../data/${req.user._id}`);

  res.render("home", {
    path: req.params.path,
    tree: tree,
    fullTree: fullFileTree,
    userData: { name: req.user.name, email: req.user.email },
  });
});

const getFileTree = (path) => {
  return dree.scan(path, {
    stat: false,
    normalize: true,
    followLinks: true,
    size: true,
    hash: false,
    depth: 200,
    exclude: /dir_to_exclude/,
  });
};

router.post(
  "/upload/:path",
  upload.array("file", 100),
  function (req, res, next) {
    res.sendStatus(200);
  }
);

router.get("/download/:path", (req, res) => {
  res.download(
    `${dataFolder}${req.user._id}/${req.params.path.replace(/&/g, "/")}`,
    req.params.path.split("$")[1]
  );
});

router.get("/zipdownload/:path/:files", (req, res) => {
  const paths = [];
  req.params.files.split("&").forEach((x) => {
    let path;
    if (req.params.path == "&root") path = x.split("@")[1];
    else path = `${req.params.path.replace(/&/g, "/")}${x.split("@")[1]}`;
    paths.push({
      type: x.split("@")[0],
      path: path,
    });
  });

  if (fs.existsSync("../files.zip")) fs.unlinkSync("../files.zip");

  const zip = new AdmZip();

  paths.forEach((x) => {
    if (x.path) {
      if (x.type == "directory")
        zip.addLocalFolder(
          dataFolder + req.user._id + "/" + x.path,
          x.path.split("/")[x.path.split("/").length - 1]
        );
      else if (x.type == "file")
        zip.addLocalFile(dataFolder + req.user._id + "/" + x.path);
    }
  });

  zip.toBuffer();
  zip.writeZip("../files.zip");
  res.download("../files.zip", `data.zip`);
});

router.post("/createDir", (req, res) => {
  const newDirPath = `${dataFolder}${req.user._id}/${req.body.path.replace(
    /&/g,
    "/"
  )}${req.body.name}`;
  if (!fs.existsSync(newDirPath)) {
    fs.mkdirSync(newDirPath);
    res.sendStatus(200);
  } else {
    res.send("already exists");
  }
});

router.post("/rename", (req, res) => {
  let newPath;
  const bodyPath = req.body.path.replace(/&/g, "/");
  if (req.body.isFile)
    newPath = `${dataFolder}${req.user._id}/${bodyPath}${uuidv4()}$${
      req.body.newName
    }`;
  else newPath = `${dataFolder}${req.user._id}/${bodyPath}${req.body.newName}`;
  if (
    fs.existsSync(`${dataFolder}${req.user._id}/${bodyPath}${req.body.srcName}`)
  ) {
    fs.rename(
      `${dataFolder}${req.user._id}/${bodyPath}${req.body.srcName}`,
      newPath,
      (err) => {
        if (err) throw err;
        res.sendStatus(200);
      }
    );
  }
});

router.post("/copyData", (req, res) => {
  req.body.paths.forEach((path) => {
    fs.copy(
      `${dataFolder}${req.user._id}/${path.srcPath}`,
      `${dataFolder}${req.user._id}/${req.body.dest}${path.fileName}`,
      (err) => {
        if (err) return console.error(err);
      }
    );
  });

  res.sendStatus(200);
});

router.post("/moveData", (req, res) => {
  req.body.paths.forEach((path) => {
    fs.move(
      `${dataFolder}${req.user._id}/${path.srcPath}`,
      `${dataFolder}${req.user._id}/${req.body.dest}${path.fileName}`,
      (err) => {
        if (err) return console.error(err);
      }
    );
  });
  res.sendStatus(200);
});

router.post("/delete", (req, res) => {
  req.body.forEach((item) => {
    const itemPath = `${dataFolder}${req.user._id}/${item
      .split("#")[1]
      .replace(/&/g, "/")}`;
    if (fs.existsSync(itemPath)) {
      if (item.split("#")[0] == "directory") deleteFolderRecursive(itemPath);
      else
        fs.unlink(itemPath, (err) => {
          if (err) throw err;
        });
    }
  });
  res.sendStatus(200);
});

const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) deleteFolderRecursive(curPath);
      else fs.unlinkSync(curPath);
    });
    fs.rmdirSync(path);
  }
};

module.exports = router;
