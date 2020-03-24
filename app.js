const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const key = require("./config/keys");
const cookieParser = require("cookie-parser");
const userRoute = require("./Route/userRoute");

// connect db
mongoose
  .connect(key.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(mess => console.log("mongoose is connect"))
  .catch(err => {
    console.log(err);
  });

//config body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// config cookie parser

app.use(cookieParser(key.secret));
mongoose.set("useFindAndModify", false);

//set view engine pug
app.set("view engine", "pug");
app.set("views", "./Views");

app.use(express.static("public"));
app.use("/user", userRoute);
app.listen(key.port, () => {
  console.log(`Server started on port ${key.port}`);
});
