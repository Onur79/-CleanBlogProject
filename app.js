const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const path = require("path");
const ejs = require("ejs");

app.set("views", path.join(__dirname, "views"));
app.engine("template", ejs.renderFile);

const Photo = require("./models/Photo");
const fs = require("fs");


//connect DB
mongoose.connect("mongodb://127.0.0.1:27017/cleanblog-test-db", {
  useNewUrlParser: true,
});

const MyLogger1 = (req, res, next) => {
  console.log("middleware log 1");
  next();
};

const MyLogger2 = (req, res, next) => {
  console.log("middleware log 2");
  next();
};

//!TEMPLATE ENGİNE
app.set("view engine", "template");

//!MİDDLEWARES
app.use(express.static("public"));
app.use(
  express.urlencoded({ extended: true })
); /*Özetle, app.use(express.urlencoded({ extended: true })) ifadesi Express.js uygulamasında
 URL kodlamasına tabi tutulmuş verileri alabilmek için kullanılır.
 Bu sayede gelen isteklerdeki form verilerini req.body üzerinden alabilir ve kullanabilirsiniz.*/

app.use(
  express.json()
); /*Özetle, app.use(express.json()) ifadesi Express.js uygulamasında JSON verilerini okuyabilmek için kullanılır.
Bu sayede gelen isteklerdeki JSON verilerini req.body üzerinden alabilir ve kullanabilirsiniz.*/
app.use(fileUpload());

//!ROUTES

app.get("/", async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  res.render("index.ejs", {
    photos,
  });
});
app.get("/photos/:idd", async (req, res) => {
  //console.log(req.params.idd);
  //res.render("about.ejs");
  const photo = await Photo.findById(req.params.idd);
  res.render("../photo.ejs", {
    photo,
  });
});

app.get("/about.ejs", (req, res) => {
  res.render("about.ejs");
});

app.get("/add.ejs", (req, res) => {
  res.render("add.ejs");
});

app.get("/index.ejs", (req, res) => {
  res.render("index.ejs");
});

app.post("/photos", async (req, res) => {
  const uploadDir = "public/uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadeImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadeImage.name;
  uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadeImage.name,
    });
    res.redirect("/");
  });

  //console.log(req.files.image)
  //await Photo.create(req.body);
  //res.redirect("/");
});

const port = 3000;
app.listen(port, () => {
  console.log(`port ${port}`);
});
