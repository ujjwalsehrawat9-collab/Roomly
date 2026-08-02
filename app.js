if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOveride = require("method-override");
const port = 8080;
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRoutes = require("./routes/listing.js");

MONGO_URL = process.env.ATLASDB_URL;
const main = async () => {
  await mongoose.connect(MONGO_URL);
};

main()
  .then(() => {
    console.log("Connected to mongo Db");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
app.engine("ejs", ejsMate);

const store=MongoStore.create({
  mongoUrl:MONGO_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("Error in mongo session store",err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());
 

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.use((err, req, res, next) => {
//   const { statusCode = 500, message = "Something went wrong!" } = err;
//   res.render("./listings/eror.ejs", { message });
//   // res.status(statusCode).send(message);
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;    
   res.status(statusCode).render("./listings/eror.ejs", { message });
});



app.use("/listings", listingRoutes);

app.listen(process.env.PORT || 8080, () => {
  console.log("server is running");
});