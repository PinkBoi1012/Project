const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const key = require("./config/keys");
const cookieParser = require("cookie-parser");
const userRoute = require("./Route/userRoute");
const clientRoute = require("./Route/clientRoute");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// connect db
mongoose
  .connect(key.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((mess) => console.log("mongoose is connect"))
  .catch((err) => {
    console.log(err);
  });

//config body parser
app.use(bodyParser.urlencoded({ extended: true }));

// config cookie parser

app.use(cookieParser(key.secret));
mongoose.set("useFindAndModify", false);

//set view engine pug
app.set("view engine", "pug");
app.set("views", "./Views");
app.set("trust proxy", 1);
// 3 hour
app.use(
  session({
    secret: key.secret,
    resave: false,
    saveUninitialized: false,

    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);

app.use(express.static("public"));
app.use("/user", userRoute);
app.use(
  "/",
  function (req, res, next) {
    res.locals.session = req.session;
    next();
  },
  clientRoute
);

app.listen(key.port, () => {
  console.log(`Server started on port ${key.port}`);
});
