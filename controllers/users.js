const User = require("../models/user");

const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

function newUser(req, res) {
  res.render("users/new.ejs");
}

function signUp(req, res) {
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(SALT_ROUNDS)
  );

  // save the user with the hashed password
  User.create(req.body, function (err, newUser) {
    // redirect back to the home route
    console.log(newUser);
    res.redirect("/");
  });
}

function signIn(req, res) {
  res.render("users/login");
}

function login(req, res) {
  // find the user in the database - we need to see if they exist
  User.findOne({ username: req.body.username }, function (err, foundUser) {
    if (foundUser === null) {
      // if they don't exist - redirect back to login
      res.redirect("/users/signin");
    } else {
      // if they do exist - compare the password, is it a match?
      const isMatched = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );
      // if the password matches - login them in
      if (isMatched) {
        //    add the user to a new session
        req.session.userId = foundUser._id;
        //   redirect to a secure location
        res.redirect("/users/profile");
      } else {
        // if the password is wrong - redirect back to login
        res.redirect("/users/signin");
      }
    }
  });
}

function profile(req, res) {
  res.render("users/profile");
}

function signOut(req, res) {
  // destroy the session
  req.session.destroy(function (err) {
    // delete req.user
    delete req.user;
    // redirect back home
    res.redirect("/");
  });
}

module.exports = {
  new: newUser,
  signUp,
  signIn,
  signOut,
  login,
  profile,
};
