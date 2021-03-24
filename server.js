// Require modules
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const authorization = require("./utils/authorization");
const port = process.env.PORT || 3000;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Set up express app
const app = express();

// Connect to DB
require("./config/database");

// Configure the app with app.set()
app.set("view engine", "ejs");

// Mount middleware with app.use()
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: false,
  })
);

////////// Express Session Playground //////////

/* Uncomment the code below to create some routes to explore how sessions work. None of this code is required for authentication to work.

Instructions:
1) Visit http://localhost:3000/first-route to save a favFood of 'pizza' in your session.
2) Visit http://localhost:3000/second-route. If your favFood is 'pizza', you'll see a Pizza Party message. Else you'll see a different message.
3) Visit http://localhost:3000/update-route. This will change your favFood to "mom's spaghetti"
4) Now Visit http://localhost:3000/second-route again and see how it changes.
5) Visit http://localhost:3000/times-visited. The counter will update each time you visit. This is stored in your session as well.
*/

// app.get("/first-route", function (req, res) {
//   req.session.favFood = "pizza";
//   console.log(req.session);
//   res.send("<h1>Foods Page</h1>");
// });

// app.get("/second-route", function (req, res) {
//   if (req.session.favFood === "pizza") {
//     res.send("<h1>Pizza Party 🎉🍕</h1>");
//   } else {
//     res.send("<h1>Wait... you don't like pizza? 😢</h1>");
//   }
// });

// app.get("/update-route", function (req, res) {
//   req.session.favFood = "mom's spaghetti";
//   res.send("<h1>You Updated Your Fav Food</h1>");
// });

// app.get("/times-visited", function (req, res) {
//   if (req.session.timesVisited === undefined) {
//     req.session.timesVisited = 1;
//   } else {
//     req.session.timesVisited++;
//   }
//   res.send(`<h1>You've visited this page ${req.session.timesVisited} time(s)`);
// });

/////////////////// END SESSION PLAYGROUND /////////////////////////

// req.user Middleware:
// Reads the session and creates a req.user with the logged in user's info.
app.use(authorization.addUserToRequest);

// Mount routes with app.use()
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Tell App to listen
app.listen(port, function () {
  console.log(`Express is listening on port:${port}`);
});
